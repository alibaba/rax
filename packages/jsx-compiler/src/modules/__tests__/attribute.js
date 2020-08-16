const t = require('@babel/types');
const { _transformAttribute } = require('../attribute');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').ali;
const wxAdapter = require('../../adapter').wechat;
const genCode = require('../../codegen/genCode');

describe('Transform JSX Attribute', () => {
  it('should transform alibaba miniapp attribute name is key', () => {
    const code = '<View key={1}>test</View>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View a:key={1}>test</View>');
  });
  it('should transform attribute name is className', () => {
    const code = '<rax-view className="box">test</rax-view>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<rax-view class="box">test</rax-view>');
  });
  it("should collect attribute name is ref and parse it's value as a string", () => {
    const code = '<View ref={scrollViewRef}>test</View>';
    const ast = parseExpression(code);
    const { refs } = _transformAttribute(ast, code, adapter);
    expect(genCode(ast).code).toEqual('<View ref="scrollViewRef" id="id_0">test</View>');
    expect(refs[0].name).toEqual({'type': 'StringLiteral', 'value': 'scrollViewRef'});
    expect(refs[0].method.name).toEqual('scrollViewRef');
  });
  it('should transform wechat native component className into class', () => {
    const code = '<rax-view className="box">test</rax-view>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, wxAdapter);
    expect(genCode(ast).code).toEqual('<rax-view class="box">test</rax-view>');
  });
  it('should not transform wechat custom component className', () => {
    const code = '<Custom className="box">test</Custom>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, wxAdapter);
    expect(genCode(ast).code).toEqual('<Custom className="box">test</Custom>');
  });
  it('should not transform wechat native component style', () => {
    const code = "<rax-view style={{width: '100rpx'}}>test</rax-view>";
    const ast = parseExpression(code);
    _transformAttribute(ast, code, wxAdapter);
    expect(genCode(ast).code).toEqual(`<rax-view style={{
  width: '100rpx'
}}>test</rax-view>`);
  });
  it('should transform wechat custom component style into styleSheet', () => {
    const code = "<Custom style={{width: '100rpx'}}>test</Custom>";
    const ast = parseExpression(code);
    _transformAttribute(ast, code, wxAdapter);
    expect(genCode(ast).code).toEqual(`<Custom styleSheet={{
  width: '100rpx'
}}>test</Custom>`);
  });
  it('should transform wechat custom component id', () => {
    const code = '<Custom id="box">test</Custom>';
    const ast = parseExpression(code);
    _transformAttribute(ast, code, wxAdapter);
    expect(genCode(ast).code).toEqual('<Custom id="box" componentId="box">test</Custom>');
  });
});
