const t = require('@babel/types');
const { _transform } = require('../style');
const { parseExpression } = require('../../parser');
const genExpression = require('../../codegen/genExpression');
const genCode = require('../../codegen/genCode');
const adapter = require('../../adapter').quickapp;

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

function genDynamicValue(dynamicValue) {
  const properties = [];
  const store = dynamicValue.getStore();
  store.map(({name, value}) => {
    properties.push(t.objectProperty(t.identifier(name), value));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

describe('Transform style', () => {
  it('should transform style props', () => {
    const raw = '<Text style={styles.name}>hello</Text>';
    const expected = '<Text style="{{s0}}">hello</Text>';
    const expectedDynamicValue = '{ s0: __create_style__(styles.name) }';
    const ast = parseExpression(raw);
    const { dynamicStyle } = _transform(ast, adapter);
    expect(genExpression(ast)).toEqual(expected);
    expect(genDynamicValue(dynamicStyle)).toEqual(expectedDynamicValue);
  });
});
