const flattenChildrenPlugin = require('../index');
const { transformSync } = require('@babel/core');

function getTransfromCode(code, opts) {
  return transformSync(code, {
    filename: './',
    presets: [
      ['@babel/preset-env', {
        'loose': true,
        'modules': false
      }],
      require.resolve('@babel/preset-react'),
    ],
    plugins: [
      ['@babel/plugin-transform-react-jsx', {
        pragma: 'createElement'
      }],
      flattenChildrenPlugin
    ],
  }).code;
}

describe('flatten children for createElement', () => {
  it('flatten children', () => {
    expect(getTransfromCode(`
<div>
  <div>a</div>
  <div>b</div>
</div>
    `)).toBe(
      'createElement("div", null, [createElement("div", null, "a"), createElement("div", null, "b")]);'
    );
  });

  it('flatten fragment', () => {
    expect(getTransfromCode(`
<div>
  <div>a</div>
  <div>b</div>
  {
    [1, 2, 3]
  }
</div>
    `)).toBe(
      'createElement("div", null, [createElement("div", null, "a"), createElement("div", null, "b"), 1, 2, 3]);'
    );
  });

  it('flatten fragment with children', () => {
    expect(getTransfromCode(`
<div>
  <div>a</div>
  <div>b</div>
  {
    [
      <div>1</div>,
      <div>2</div>
    ]
  }
</div>
    `)).toBe('createElement("div", null, [createElement("div", null, "a"), createElement("div", null, "b"), createElement("div", null, "1"), createElement("div", null, "2")]);'
    );
  });

  it('do nothing when only one child', () => {
    expect(getTransfromCode(`
<div>
  <div>a</div>
</div>
    `)).toBe(
      'createElement("div", null, createElement("div", null, "a"));'
    );
  });
});
