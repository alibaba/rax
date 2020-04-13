const t = require('@babel/types');
const { _transformAttribute, _transformPreComponentAttr } = require('../attribute');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
const genCode = require('../../codegen/genCode');

describe('Transform JSX Attribute', () => {
  it('should transform attribute name is key', () => {
    const code = '<View key={1}>test</View>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View key={1}>test</View>');
  });
  it('should transform attribute name is className', () => {
    const code = '<rax-view className="box">test</rax-view>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<rax-view class="box">test</rax-view>');
  });
  it("should collect attribute name is ref and parse it's value as a string in quickApp", () => {
    const code = '<View ref={scrollViewRef}>test</View>';
    const ast = parseExpression(code);
    const { refs } = _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View id="scrollViewRef">test</View>');
    expect(refs[0].name.value).toEqual('scrollViewRef');
  });
  it('should transform quickApp custom component style into styleSheet', () => {
    const code = "<rax-link style={{width: '100rpx'}}>test</rax-link>";
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual(`<rax-link styleSheet={{
  width: '100rpx'
}}>test</rax-link>`);
  });
});