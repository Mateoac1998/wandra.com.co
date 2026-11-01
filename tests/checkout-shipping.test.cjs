const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const rates = [
  { id: 'coordinadora::standard', carrier: 'coordinadora', service: 'standard', price: 9000, currency: 'COP' },
  { id: 'tcc::standard', carrier: 'tcc', service: 'standard', price: 11000, currency: 'COP' },
];

function checkout() {
  const captured = { orders: [], preferences: [] };
  const source = fs.readFileSync(path.join(__dirname, '../app/api/checkout/route.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'require', 'fetch', 'process', compiled)(module, module.exports, (id) => {
    if (id === 'next/server') return { NextResponse: { json: (data, options) => Response.json(data, options) } };
    if (id.endsWith('/catalog')) return { products: [{ name: 'Kombucha', description: 'Test', variants: [{ sku: 'KC050', label: '500 ml', price: 12000 }] }] };
    if (id.endsWith('/envia')) return { ShippingQuoteError: Error, getShippingRates: async () => rates };
    if (id.endsWith('/shipping-logistics')) return { inferShippingLogistics: () => ({ weight: .82, length: 6, width: 6, height: 24.4 }) };
    if (id.endsWith('/supabase/admin')) return { getSupabaseAdmin: () => ({
      from: () => ({ insert: (order) => { captured.orders.push(order); return { select: () => ({ single: async () => ({ data: { id: 'order-test' }, error: null }) }) }; } }),
    }) };
    throw new Error(id);
  }, async (_url, options) => {
    captured.preferences.push(JSON.parse(options.body));
    return Response.json({ init_point: 'https://example.com/pay' });
  }, { env: { MERCADOPAGO_ACCESS_TOKEN: 'test-only', NEXT_PUBLIC_SITE_URL: 'https://example.com' } });
  return { post: module.exports.POST, captured };
}

const request = (optionId, price) => new Request('https://example.com/api/checkout', {
  method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({
    items: [{ sku: 'KC050', quantity: 2 }],
    customer: { fullName: 'Test Buyer', email: 'buyer@example.com', phone: '3000000000', documentType: 'CC', documentNumber: '1000', city: 'Armenia', department: 'Quindío', address: 'Test address' },
    shipping: { optionId, price },
  }),
});

test('chosen carrier and shipping amount are persisted and added once to Mercado Pago', async () => {
  const { post, captured } = checkout();
  const response = await post(request('tcc::standard', 11000));
  assert.equal(response.status, 200);
  assert.equal(captured.orders[0].total_amount, 35000);
  assert.deepEqual(captured.orders[0].items.shipping, rates[1]);
  assert.equal(captured.preferences[0].external_reference, 'order-test');
  assert.equal(captured.preferences[0].items.at(-1).unit_price, 11000);
  assert.equal(captured.preferences[0].items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0), 35000);
});

test('a stale or tampered shipping price cannot create an order or preference', async () => {
  const { post, captured } = checkout();
  const response = await post(request('tcc::standard', 1));
  assert.equal(response.status, 409);
  assert.equal(captured.orders.length, 0);
  assert.equal(captured.preferences.length, 0);
});
