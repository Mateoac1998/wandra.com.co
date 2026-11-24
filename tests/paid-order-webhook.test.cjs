const { test } = require('node:test');
const assert = require('node:assert/strict');
const { createHmac } = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

const orderId = '6a55a438-ef51-493a-8d46-d4b2b0b63ee3';
const paymentId = '123456';
const secret = 'test-webhook';
const order = {
  id: orderId,
  customer_name: 'Cliente de prueba',
  customer_email: 'cliente@example.com',
  customer_phone: '3101234567',
  shipping_address: 'Carrera 43 # 30-21',
  shipping_city: 'Envigado, Antioquia',
  total_amount: 35000,
  items: {
    products: [{ title: 'Kombucha Café · 500 ml', quantity: 2, unit_price: 12000 }],
    shipping: { carrier: 'coordinadora', service: 'ground', currency: 'COP', price: 11000 },
    shipment: {
      origin: { city: '63001000', country: 'CO' },
      destination: { city: '05266000', country: 'CO', street: 'Carrera 43 # 30-21' },
      packages: Array.from({ length: 2 }, () => ({
        weight: .82, dimensions: { length: 6, width: 6, height: 24.4 },
      })),
    },
  },
};

function harness({ payment = {}, ambiguousShipment = false, transientEmail = false } = {}) {
  const jobs = new Map();
  let confirmedPayment;
  const db = {
    rpc: async (name, args) => {
      if (name === 'confirm_paid_order') {
        assert.equal(args.p_order_id, orderId);
        if (args.p_amount !== order.total_amount) return { data: { state: 'mismatch' } };
        confirmedPayment ??= args.p_payment_id;
        return { data: { state: 'ready', order } };
      }
      assert.equal(name, 'claim_order_fulfillment');
      const job = jobs.get(args.p_action);
      if (job?.status === 'processing') return { data: { state: 'busy' } };
      if (['done', 'review'].includes(job?.status)) return { data: { state: job.status } };
      jobs.set(args.p_action, { status: 'processing' });
      return { data: { state: 'claimed', token: args.p_action } };
    },
    from: (table) => {
      assert.equal(table, 'order_fulfillment');
      return {
        update: (data) => {
          const matches = {};
          const query = {
            eq: (field, value) => { matches[field] = value; return query; },
            select: () => query,
            maybeSingle: async () => {
              assert.equal(matches.order_id, orderId);
              assert.equal(matches.claim_token, matches.action);
              jobs.set(matches.action, data);
              return { data: { action: matches.action } };
            },
          };
          return query;
        },
      };
    },
  };

  const shipments = [];
  const emails = [];
  let customerAttempt = 0;
  async function fetchMock(url, options) {
    if (url === `https://api.mercadopago.com/v1/payments/${paymentId}`) {
      return Response.json({ status: 'approved', external_reference: orderId, currency_id: 'COP', transaction_amount: '35000.00', ...payment });
    }
    if (url === 'https://api.envia.com/ship/generate/') {
      shipments.push(JSON.parse(options.body));
      if (ambiguousShipment) throw new Error('Connection closed after request');
      return Response.json({ meta: 'generate', data: [{ trackingNumber: 'A001' }, { trackingNumber: 'A002' }] });
    }
    assert.equal(url, 'https://api.resend.com/emails');
    const email = JSON.parse(options.body);
    emails.push({ ...email, key: options.headers['Idempotency-Key'] });
    if (transientEmail && email.to === order.customer_email && ++customerAttempt === 1) {
      return Response.json({}, { status: 502 });
    }
    return Response.json({ id: `email-${emails.length}` });
  }

  const modules = new Map();
  function load(filename) {
    const absolute = path.resolve(__dirname, '..', filename);
    if (modules.has(absolute)) return modules.get(absolute);
    const source = fs.readFileSync(absolute, 'utf8');
    const js = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }).outputText;
    const module = { exports: {} };
    new Function('module', 'exports', 'require', 'fetch', 'process', js)(module, module.exports, (id) => {
      if (id === 'next/server') return { NextResponse: Response };
      if (id === 'node:crypto') return require(id);
      if (id.endsWith('/supabase/admin')) return { getSupabaseAdmin: () => db };
      return load(path.relative(path.resolve(__dirname, '..'), path.resolve(path.dirname(absolute), id)) + '.ts');
    }, fetchMock, {
      env: {
        MERCADOPAGO_WEBHOOK_SECRET: secret, MERCADOPAGO_ACCESS_TOKEN: 'test-only',
        ENVIA_API_TOKEN: 'test-only', RESEND_API_KEY: 'test-only',
        ORDER_EMAIL_FROM: 'Wandra <test@example.com>',
      },
    });
    modules.set(absolute, module.exports);
    return module.exports;
  }
  return { handle: load('app/api/webhooks/mercadopago/route.ts').POST, shipments, emails, jobs,
    payment: () => confirmedPayment };
}

function notification(signature) {
  const hash = createHmac('sha256', secret).update(`id:${paymentId};request-id:request-test;ts:123;`).digest('hex');
  return new Request(`https://example.com/api/webhooks/mercadopago?data.id=${paymentId}`, {
    method: 'POST',
    headers: { 'x-signature': signature ?? `ts=123,v1=${hash}`, 'x-request-id': 'request-test' },
    body: '{}',
  });
}

test('a confirmed payment purchases the selected service once and sends two accurate receipts', async () => {
  const fixture = harness();
  const results = await Promise.all([fixture.handle(notification()), fixture.handle(notification())]);
  assert.ok(results.some((result) => result.status === 200));
  assert.equal((await fixture.handle(notification())).status, 200);
  assert.equal(fixture.payment(), paymentId);
  assert.equal(fixture.shipments.length, 1);
  assert.deepEqual(fixture.shipments[0].shipment, { type: 1, carrier: 'coordinadora', service: 'ground' });
  assert.deepEqual(fixture.shipments[0].packages, order.items.shipment.packages);
  assert.equal(fixture.shipments[0].destination.city, '05266000');
  assert.deepEqual(fixture.jobs.get('shipment').tracking_numbers, ['A001', 'A002']);
  assert.equal(fixture.emails.length, 2);
  const admin = fixture.emails.find((email) => email.to === 'Herenciawandra.ma@gmail.com');
  const customer = fixture.emails.find((email) => email.to === order.customer_email);
  assert.match(admin.text, /Cliente de prueba[\s\S]*3101234567[\s\S]*Carrera 43 # 30-21[\s\S]*Envigado, Antioquia/);
  assert.match(customer.text, /Estamos preparando tu pedido/);
  for (const email of fixture.emails) {
    assert.match(email.text, /2 × Kombucha Café/);
    assert.match(email.text, /Envío cobrado:.*11[.,]000.*COP/);
  }
});

test('a lost Envia response requires review and a transient email retries independently', async () => {
  const fixture = harness({ ambiguousShipment: true, transientEmail: true });
  assert.equal((await fixture.handle(notification())).status, 503);
  assert.equal(fixture.jobs.get('shipment').status, 'review');
  assert.equal((await fixture.handle(notification())).status, 200);
  assert.equal(fixture.shipments.length, 1);
  const attempts = fixture.emails.filter((email) => email.to === order.customer_email);
  assert.equal(attempts.length, 2);
  assert.equal(attempts[0].key, attempts[1].key);
  assert.equal(attempts[0].text, attempts[1].text);
  assert.equal(fixture.emails.length, 3);
});

test('rejected signatures, pending payments, wrong currencies and mismatched amounts do not fulfill', async () => {
  const badSignature = harness();
  assert.equal((await badSignature.handle(notification('ts=123,v1=abc'))).status, 401);
  for (const payment of [{ status: 'pending' }, { live_mode: false }, { currency_id: 'USD' }, { transaction_amount: 1 }]) {
    const fixture = harness({ payment });
    assert.equal((await fixture.handle(notification())).status, 200);
    assert.equal(fixture.payment(), undefined);
    assert.equal(fixture.shipments.length + fixture.emails.length, 0);
  }
});
