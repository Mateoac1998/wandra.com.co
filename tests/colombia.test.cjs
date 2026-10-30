const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');

function loadCatalog() {
  const source = fs.readFileSync(path.join(__dirname, '../lib/colombia.ts'), 'utf8');
  const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
  const module = { exports: {} };
  new Function('module', 'exports', compiled)(module, module.exports);
  return module.exports;
}

test('municipality catalog covers all departments with unique DANE codes', () => {
  const { colombiaDepartments, colombiaMunicipalities } = loadCatalog();
  assert.equal(colombiaDepartments.length, 33); // 32 departments plus Bogotá D.C.
  const municipalities = Object.values(colombiaMunicipalities).flat();
  assert.equal(municipalities.length, 1122);
  assert.equal(new Set(municipalities.map(({ code }) => code)).size, 1122);
  assert.ok(municipalities.every(({ code, name }) => /^\d{5}$/.test(code) && name));
});

test('department selection yields only its own municipalities, including duplicate city names', () => {
  const { colombiaMunicipalities } = loadCatalog();
  assert.equal(colombiaMunicipalities['Quindío'].length, 12);
  assert.deepEqual(colombiaMunicipalities['Quindío'].find(({ name }) => name === 'ARMENIA'), { code: '63001', name: 'ARMENIA' });
  assert.equal(colombiaMunicipalities['Quindío'].some(({ name }) => name === 'MEDELLÍN'), false);
  assert.equal(colombiaMunicipalities['Quindío'].find(({ name }) => name === 'CÓRDOBA').code, '63212');
  assert.equal(colombiaMunicipalities['Nariño'].find(({ name }) => name === 'CÓRDOBA').code, '52215');
  assert.equal(colombiaMunicipalities['Bogotá'].length, 1);
});
