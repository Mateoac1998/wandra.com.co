const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const React = require('react');
const { renderToStaticMarkup } = require('react-dom/server');
const source = fs.readFileSync(path.join(__dirname, '../components/shipping-rate-options.tsx'), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
const component = { exports: {} };
new Function('module', 'exports', 'require', compiled)(component, component.exports, require);

test('radio cards show carrier, delivery, COP price and the selected carrier', () => {
  const html = renderToStaticMarkup(React.createElement(component.exports.ShippingRateOptions, {
    options: [
      { id: 'coordinadora::normal', carrier: 'coordinadora', service: 'ground_small', price: 9000, currency: 'COP', deliveryDays: 2 },
      { id: 'tcc::normal', carrier: 'tcc', service: 'normal', price: 11000, currency: 'COP' },
    ], selectedId: 'tcc::normal', onSelect: () => {},
  }));
  assert.equal((html.match(/type="radio"/g) || []).length, 2);
  assert.equal((html.match(/checked=""/g) || []).length, 1);
  assert.match(html, /Coordinadora/);
  assert.match(html, /TCC/);
  assert.match(html, /Paquetes pequeños/);
  assert.doesNotMatch(html, /ground_small/);
  assert.match(html, /2 días hábiles/);
  assert.match(html, /9\.000/);
  assert.match(html, /11\.000/);
  assert.match(html, /checked=""[^>]*value="tcc::normal"|value="tcc::normal"[^>]*checked=""/);
});
