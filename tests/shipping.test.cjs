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
  items: [{ id: 'KC050', title: 'Kombucha Café · 500 ml', quantity: 2, unit_price: 12000, logistics: { weight: 0.82, length: 6, width: 6, height: 24.4 } }],
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
  assert.deepEqual(calls[2].body.shipment, { type: 1 });
  assert.deepEqual(calls[1].body, { country: 'CO', state: 'QU', city: 'Armenia' });
  assert.deepEqual(calls[2].body.origin, {
    name: 'Wandra', phone: '+573214320429', street: 'Calle de prueba', number: '1-2',
    district: 'Centro', city: '63001000', state: 'QU', country: 'CO', postalCode: '630001',
  });
  assert.equal(calls[2].body.destination.city, '63001000');
  assert.equal(calls[2].body.destination.state, 'QU');
  assert.equal(calls[2].body.destination.postalCode, '');
  assert.equal(calls[2].body.packages.length, 2);
  assert.deepEqual(calls[2].body.packages[0], {
    type: 'box', content: 'Alimentos', amount: 1, declaredValue: 12000,
    weight: 0.82, dimensions: { length: 6, width: 6, height: 24.4 },
    weightUnit: 'KG', lengthUnit: 'CM',
  });
  assert.equal(calls[2].body.packages.reduce((sum, item) => sum + item.declaredValue, 0), 24000);
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

test('mixed carts create one package per unit, including one box per six-pack', () => {
  const { buildShippingPackages } = loadShipping(() => { throw new Error('Network not expected'); });
  const items = [...input.items, { id: 'KSX280', title: 'Six pack', quantity: 2, unit_price: 42000,
    logistics: { weight: 2.71, length: 16.5, width: 11, height: 16.4 } }];
  const packages = buildShippingPackages(items);
  assert.equal(packages.length, 4);
  assert.equal(packages[2].weight, 2.71);
  assert.deepEqual(packages[2].dimensions, { length: 16.5, width: 11, height: 16.4 });
  assert.ok(packages.every((item) => item.amount === 1 && item.weightUnit === 'KG' && item.lengthUnit === 'CM' && item.content === 'Alimentos'));
  assert.equal(packages.reduce((sum, item) => sum + item.declaredValue, 0), 108000);
});

test('invalid or missing shipping dimensions are rejected', () => {
  const { buildShippingPackages } = loadShipping(() => { throw new Error('Network not expected'); });
  assert.throws(() => buildShippingPackages([{ ...input.items[0], logistics: { ...input.items[0].logistics, height: 0 } }]), /medidas de envío válidas/);
  assert.throws(() => buildShippingPackages([{ ...input.items[0], quantity: 1.5 }]), /medidas de envío válidas/);
});

test('location names are accent-free Title Case before requesting Envia', async () => {
  const calls = [];
  const { getShippingRates, normalizeLocationName } = loadShipping(async (url, options) => {
    calls.push({ url, body: options?.body ? JSON.parse(options.body) : null });
    return response(url.includes('/state?') ? states : url.endsWith('/locate') ? location : { data: [{ carrier: 'test', service: 'standard', totalPrice: 9000 }] });
  });
  assert.equal(normalizeLocationName('  QUINDÍO  '), 'Quindio');
  assert.equal(normalizeLocationName('  SAN   JOSÉ '), 'San Jose');
  await getShippingRates({ ...input, department: '  QUINDÍO ', city: ' ARMÉNIA ' });
  assert.deepEqual(calls[1].body, { country: 'CO', state: 'QU', city: 'Armenia' });
  assert.equal(calls[2].body.destination.city, '63001000');
});

test('shipping accepts stateCode without department while validating it', async () => {
  const { getShippingRates } = loadShipping(async (url) =>
    response(url.includes('/state?') ? states : url.endsWith('/locate') ? location : { data: [{ carrier: 'test', service: 'standard', totalPrice: 9000 }] }));
  const rates = await getShippingRates({ ...input, department: undefined, stateCode: ' qu ' });
  assert.equal(rates[0].price, 9000);
  await assert.rejects(getShippingRates({ ...input, stateCode: 'AN' }), /no coincide/);
});

test('Bogota D.C. from the department selector matches Envia Bogota', async () => {
  const { getShippingRates } = loadShipping(async (url) => response(
    url.includes('/state?') ? { data: [{ name: 'Bogotá', code_2_digits: 'DC' }] } :
    url.endsWith('/locate') ? { city: '11001000', name: 'BOGOTA', state: 'DC' } :
    { data: [{ carrier: 'test', service: 'standard', totalPrice: 9000 }] }));
  const rates = await getShippingRates({ ...input, department: 'Bogotá', city: 'BOGOTÁ, D.C.' });
  assert.equal(rates[0].price, 9000);
});

test('aggregates discovered carriers, preserves valid rates when some lack coverage, and deduplicates', async () => {
  const requested = [];
  const { getShippingRates } = loadShipping(async (url, options) => {
    if (url.includes('/state?')) return response(states);
    if (url.endsWith('/locate')) return response(location);
    if (url.includes('/carrier?')) return response({ data: [
      { name: 'coordinadora', description: 'Coordinadora', active: true },
      { name: 'interrapidisimo', description: 'Interrapidísimo', active: 1 },
      { name: 'tcc', description: 'TCC', active: true },
      { name: 'inactive', active: false },
    ] });
    const body = JSON.parse(options.body);
    const carrier = body.shipment.carrier;
    requested.push(carrier);
    if (!carrier) return response({ meta: 'error', error: { message: 'Required property missing: carrier' } });
    if (carrier === 'tcc') return response({ meta: 'error', error: { message: 'No coverage' } });
    return response({ data: [
      { carrier, service: 'standard', totalPrice: carrier === 'coordinadora' ? 10000 : 9000, currency: 'COP', deliveryDays: 2 },
      { carrier, service: 'standard', totalPrice: 12000, currency: 'COP' },
      { carrier, service: 'international', totalPrice: 1, currency: 'USD' },
    ] });
  });
  const original = console.error;
  console.error = () => {};
  try {
    const rates = await getShippingRates(input);
    assert.equal(rates.length, 2);
    assert.deepEqual(rates.map(({ carrier }) => carrier), ['interrapidisimo', 'coordinadora']);
    assert.deepEqual(rates.map(({ price }) => price), [9000, 10000]);
    assert.equal(rates[0].carrierName, 'Interrapidísimo');
    assert.equal(rates[0].deliveryDays, 2);
    assert.equal(requested.includes('inactive'), false);
    assert.equal(requested.includes('envia'), false);
  } finally { console.error = original; }
});

test('does not query carrier catalog after an authentication failure', async () => {
  let queries = 0;
  const { getShippingRates } = loadShipping(async (url) => {
    if (url.includes('/state?')) return response(states);
    if (url.endsWith('/locate')) return response(location);
    if (url.includes('/carrier?')) queries++;
    return response({ error: { message: 'Invalid token' } }, 401);
  });
  const original = console.error;
  console.error = () => {};
  try {
    await assert.rejects(getShippingRates(input), (error) => error.upstreamStatus === 401);
    assert.equal(queries, 0);
  } finally { console.error = original; }
});
