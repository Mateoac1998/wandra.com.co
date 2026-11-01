const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function compile(relativePath) {
  return ts.transpileModule(fs.readFileSync(path.join(__dirname, relativePath), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
}
const shipping = { exports: {} };
new Function('module', 'exports', compile('../lib/envia.ts'))(shipping, shipping.exports);
const { EnviaApiError, ShippingQuoteError } = shipping.exports;

function loadRoute(error) {
  const module = { exports: {} };
  new Function('module', 'exports', 'require', compile('../app/api/shipping/quote/route.ts'))(module, module.exports, (id) => {
    if (id === 'next/server') return { NextResponse: { json: (data, init) => Response.json(data, init) } };
    if (id.endsWith('/catalog')) return { products: [{ name: 'Kombucha', variants: [{ sku: 'KC050', label: '500 ml', price: 12000 }] }] };
    if (id.endsWith('/envia')) return { EnviaApiError, ShippingQuoteError, getShippingRates: async () => { throw error; } };
    if (id.endsWith('/shipping-logistics')) return { inferShippingLogistics: () => ({ weight: .82, length: 6, width: 6, height: 24.4 }) };
    throw new Error('Unexpected import: ' + id);
  });
  return module.exports.POST;
}

const request = () => new Request('https://example.com/api/shipping/quote', {
  method: 'POST', headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ department: 'Quindío', city: 'Armenia', items: [{ sku: 'KC050', quantity: 1 }] }),
});

test('quote route preserves the complete nested upstream error JSON with HTTP 422', async () => {
  const payload = { meta: 'error', error: { code: 1234, message: 'Invalid package', fields: [{ field: 'packages.0.type', expected: ['box'] }] } };
  const response = await loadRoute(new EnviaApiError('generic message', payload, 400))(request());
  assert.equal(response.status, 422);
  assert.deepEqual(await response.json(), { enviaError: payload, enviaStatus: 400 });
});

test('quote route also exposes semantic Envia errors returned with HTTP 200', async () => {
  const payload = { meta: 'error', data: [], error: { message: 'Carrier is required' } };
  const response = await loadRoute(new EnviaApiError('generic message', payload, 200))(request());
  assert.equal(response.status, 422);
  assert.deepEqual((await response.json()).enviaError, payload);
});

test('local validation errors do not get mislabeled as Envia diagnostics', async () => {
  const original = console.error;
  console.error = () => {};
  try {
    const response = await loadRoute(new ShippingQuoteError('Configuración incompleta'))(request());
    assert.deepEqual(await response.json(), { error: 'Configuración incompleta' });
  } finally {
    console.error = original;
  }
});
