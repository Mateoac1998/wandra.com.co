import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { webcrypto } from 'node:crypto';
import vm from 'node:vm';
import test from 'node:test';
import ts from 'typescript';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const packageRequire = createRequire(import.meta.url);
const input = {
  items: [{ sku: 'KC028', quantity: 2, price: 1 }],
  customer: {
    fullName: 'Prueba Tecnica',
    email: 'qa@example.com',
    phone: '3000000000',
    documentType: 'CC',
    documentNumber: '1000000000',
    city: 'Armenia',
    address: 'Prueba sin entrega',
  },
};
const providerResponse = {
  id: 'test-preference',
  init_point: 'https://www.mercadopago.com/checkout/live',
  sandbox_init_point: 'https://sandbox.mercadopago.com/checkout/test',
};

// Load the actual handler and catalogue with isolated env/fetch; no network or credentials.
function createHandler(environment, fetch) {
  const logs = [];
  const cache = new Map();
  function load(filename) {
    if (cache.has(filename)) return cache.get(filename).exports;
    const module = { exports: {} };
    cache.set(filename, module);
    const compiled = ts.transpileModule(readFileSync(filename, 'utf8'), {
      compilerOptions: {
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES2022,
      },
    }).outputText;
    vm.runInNewContext(
      compiled,
      {
        module,
        exports: module.exports,
        require: (name) =>
          name.startsWith('@/')
            ? load(path.join(root, `${name.slice(2)}.ts`))
            : packageRequire(name),
        process: {
          env: {
            MERCADOPAGO_ACCESS_TOKEN: 'fake-token',
            NEXT_PUBLIC_SITE_URL: 'https://www.wandra.com.co',
            ...environment,
          },
        },
        console: {
          info: (...args) => logs.push(args),
          error: (...args) => logs.push(args),
        },
        fetch,
        crypto: webcrypto,
        URL,
        Request,
        Response,
        AbortSignal,
        Error,
      },
      { filename },
    );
    return module.exports;
  }
  return {
    POST: load(path.join(root, 'app/api/checkout/route.ts')).POST,
    logs,
  };
}

function request(body = input) {
  return new Request('https://audit-preview.vercel.app/api/checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
}

test('Preview selects sandbox and returns to its own origin; server recalculates price', async () => {
  let body;
  const { POST, logs } = createHandler(
    { VERCEL_ENV: 'preview' },
    async (_url, options) => {
      body = JSON.parse(options.body);
      assert.ok(options.signal instanceof AbortSignal);
      return Response.json(providerResponse);
    },
  );
  const response = await POST(request());
  const result = await response.json();
  assert.equal(response.status, 200);
  assert.equal(result.mode, 'sandbox');
  assert.equal(result.checkoutUrl, providerResponse.sandbox_init_point);
  assert.equal(result.preferenceId, 'test-preference');
  assert.equal(body.items[0].unit_price, 8000);
  assert.equal(body.items[0].quantity, 2);
  for (const url of Object.values(body.back_urls))
    assert.equal(new URL(url).origin, 'https://audit-preview.vercel.app');
  const recorded = JSON.stringify(logs);
  assert.ok(recorded.includes('wandra.checkout.created'));
  for (const privateValue of [
    'fake-token',
    'qa@example.com',
    'Prueba sin entrega',
    '3000000000',
    '1000000000',
  ])
    assert.ok(!recorded.includes(privateValue));
});

test('Production keeps live URL and configured production return domain', async () => {
  let body;
  const { POST } = createHandler(
    { VERCEL_ENV: 'production' },
    async (_url, options) => {
      body = JSON.parse(options.body);
      return Response.json(providerResponse);
    },
  );
  const response = await POST(request());
  const result = await response.json();
  assert.equal(result.mode, 'production');
  assert.equal(result.checkoutUrl, providerResponse.init_point);
  for (const url of Object.values(body.back_urls))
    assert.equal(new URL(url).origin, 'https://www.wandra.com.co');
});

test('Preview fails instead of falling back to live URL when sandbox URL is missing', async () => {
  const { POST } = createHandler({ VERCEL_ENV: 'preview' }, async () =>
    Response.json({ init_point: providerResponse.init_point }),
  );
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.equal((await response.json()).checkoutUrl, undefined);
});

test('Provider rejection is traceable without copying provider payload into logs', async () => {
  const { POST, logs } = createHandler({ VERCEL_ENV: 'preview' }, async () =>
    Response.json({ message: input.customer.email }, { status: 401 }),
  );
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.ok((await response.json()).reference.startsWith('WHS-'));
  assert.ok(JSON.stringify(logs).includes('provider_rejected'));
  assert.ok(!JSON.stringify(logs).includes(input.customer.email));
});

test('Network exception returns controlled JSON instead of crashing', async () => {
  const { POST } = createHandler({ VERCEL_ENV: 'preview' }, async () => {
    throw new Error('network down');
  });
  const response = await POST(request());
  assert.equal(response.status, 502);
  assert.equal((await response.json()).mode, 'sandbox');
});

test('Provider timeout returns 504 with a reference', async () => {
  const { POST } = createHandler({ VERCEL_ENV: 'preview' }, async () => {
    const error = new Error('timed out');
    error.name = 'TimeoutError';
    throw error;
  });
  const response = await POST(request());
  assert.equal(response.status, 504);
  assert.ok((await response.json()).reference);
});

test('Null payload and unknown SKU are rejected before contacting Mercado Pago', async () => {
  const { POST } = createHandler({ VERCEL_ENV: 'preview' }, () => {
    throw new Error('must not call provider');
  });
  assert.equal((await POST(request(null))).status, 400);
  assert.equal(
    (
      await POST(
        request({ ...input, items: [{ sku: 'UNKNOWN', quantity: 1 }] }),
      )
    ).status,
    400,
  );
});
