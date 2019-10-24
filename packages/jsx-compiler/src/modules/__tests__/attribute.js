const t = require('@babel/types');
const { _transformAttribute } = require('../attribute');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').ali;
const genCode = require('../../codegen/genCode');

describe('Transform JSX Attribute', () => {
  it('should transform attribute name is key', () => {
    const code = '<View key={1}>test</View>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View a:key={1}>test</View>');
  });
  it('should transform attribute name is className', () => {
    const code = '<View className="box">test</View>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View class="box">test</View>');
  });
  it("should collect attribute name is ref and parse it's value as a string", () => {
    const code = '<View ref={scrollViewRef}>test</View>';
    const ast = parseExpression(code);
    const refs = _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View ref="scrollViewRef">test</View>');
    expect(refs).toEqual([t.stringLiteral('scrollViewRef')]);
  });
});
