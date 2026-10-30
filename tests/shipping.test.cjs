const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadShipping(fetch) {
  const source = fs.readFileSync(path.join(__dirname, '../lib/envia.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 } }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', 'fetch', 'process', compiled)(module, module.exports, fetch, {
    env: { ENVIA_API_TOKEN: 'test-only', ENVIA_ORIGIN_STREET: 'Calle de prueba', ENVIA_ORIGIN_NUMBER: '1-2', ENVIA_ORIGIN_POSTAL_CODE: '630001' },
  });
  return module.exports;
}

const input = {
  department: 'Quindío', city: 'Armenia', address: 'Carrera 10 # 20-30',
  items: [{ id: 'KC050', title: 'Kombucha Café · 500 ml', quantity: 2, unit_price: 12000 }],
};
const states = { data: [{ name: 'Quindio', code_2_digits: 'QU' }] };
const location = { city: '63001000', name: 'ARMENIA', state: 'QU' };
const response = (data, status = 200) => new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json' } });

test('quotes without a buyer postal code and maps names to validated Envia codes', async () => {
  const calls = [];
  const { getShippingRates } = loadShipping(async (url, options) => {
    calls.push({ url, body: options?.body ? JSON.parse(options.body) : null });
    if (url.includes('/state?')) return response(states);
    if (url.endsWith('/locate')) return response(location);
    return response({ data: [{ carrier: 'test', service: 'standard', totalPrice: 9000, currency: 'COP' }] });
  });
  const rates = await getShippingRates(input);
  assert.equal(rates[0].price, 9000);
  assert.deepEqual(calls[1].body, { country: 'CO', state: 'QU', city: 'Armenia' });
  assert.deepEqual(calls[2].body.origin, {
    name: 'Wandra', phone: '+573214320429', street: 'Calle de prueba', number: '1-2',
    district: 'Centro', city: '63001000', state: 'QU', country: 'CO', postalCode: '630001',
  });
  assert.equal(calls[2].body.destination.city, '63001000');
  assert.equal(calls[2].body.destination.state, 'QU');
  assert.equal(calls[2].body.destination.postalCode, '');
  assert.equal(calls[2].body.packages[0].declaredValue, 24000);
});

test('rejects a municipality returned in a different department before requesting rates', async () => {
  let calls = 0;
  const { getShippingRates } = loadShipping(async () => {
    calls++;
    return response(calls === 1 ? states : { ...location, state: 'AN' });
  });
  await assert.rejects(getShippingRates(input), /nombre completo del municipio/);
  assert.equal(calls, 2);
});

test('rejects a partial city match before requesting rates', async () => {
  let calls = 0;
  const { getShippingRates } = loadShipping(async () => response(++calls === 1 ? states : location));
  await assert.rejects(getShippingRates({ ...input, city: 'Arme' }), /nombre completo del municipio/);
  assert.equal(calls, 2);
});

test('logs Envia semantic errors even when HTTP status is 200', async () => {
  let calls = 0;
  const logs = [];
  const original = console.error;
  console.error = (...args) => logs.push(args);
  try {
    const payload = { meta: 'error', error: { message: 'No coverage' } };
    const { getShippingRates } = loadShipping(async () => response(++calls === 1 ? states : calls === 2 ? location : payload));
    await assert.rejects(getShippingRates(input), /no pudo cotizar/);
    assert.deepEqual(logs[0], ['Envia API Error:', payload]);
  } finally {
    console.error = original;
  }
});
