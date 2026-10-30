const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const source = fs.readFileSync(path.join(__dirname, '../lib/catalog.ts'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const catalog = { exports: {} };
new Function('module', 'exports', 'require', compiled)(catalog, catalog.exports, () => ({ media: {} }));
const { products } = catalog.exports;
const variants = new Map(products.flatMap((product) => product.variants.map((variant) => [variant.sku, variant])));

test('catalog has Wandra measurements for every shipping presentation', () => {
  const expected = {
    KC028: [0.45, 5.5, 5.5, 16.4], KC050: [0.82, 6, 6, 24.4],
    KJ028: [0.45, 5.5, 5.5, 16.4], KJ050: [0.82, 6, 6, 24.4],
    KFJ028: [0.45, 5.5, 5.5, 16.4], KFJ050: [0.82, 6, 6, 24.4],
    KSX280: [2.71, 16.5, 11, 16.4], KSX500: [5, 18, 12, 24.4],
    GH025: [0.36, 5, 5, 11.8], GH050: [0.66, 7.3, 7.3, 14], GH100: [1.26, 9.5, 9.5, 18],
    AC025: [0.35, 5, 5, 11.8], AC050: [0.64, 7.3, 7.3, 14], AC100: [1.27, 9.5, 9.5, 18],
    'AA050-H': [0.64, 7.3, 7.3, 14], 'AA010-H': [1.27, 9.5, 9.5, 18],
  };
  for (const [sku, dimensions] of Object.entries(expected)) {
    const { weight, length, width, height } = variants.get(sku).logistics;
    assert.deepEqual([weight, length, width, height], dimensions, sku);
  }
  for (const variant of variants.values()) {
    assert.ok(Object.values(variant.logistics).every((value) => Number.isFinite(value) && value > 0), variant.sku);
  }
});

test('national catalog does not sell one-liter kombucha', () => {
  for (const product of products.filter((item) => item.category === 'Kombucha')) {
    assert.equal(product.variants.some((variant) => /1000\s*ml/i.test(variant.label)), false);
  }
});
