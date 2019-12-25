const { parse } = require('../rax-text');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').ali;
const wxAdapter = require('../../adapter').wechat;
const genCode = require('../../codegen/genCode');

describe('Transform rax-text', () => {
  it('should transform rax-text children into __content props in wechat', () => {
    const code = '<rax-text>{{_d0}}123</rax-text>';
    const ast = parseExpression(code);
    parse({
      templateAST: ast
    }, code, {
      adapter: wxAdapter
    });
    expect(genCode(ast).code).toEqual(`<rax-text __content="{{ _d0 }}123">{{
    _d0
  }}123</rax-text>`);
  });
  it('should not transform rax-text children into __content props in ali', () => {
    const code = '<rax-text>{{_d0}}123</rax-text>';
    const ast = parseExpression(code);
    parse({
      templateAST: ast
    }, code, {
      adapter
    });
    expect(genCode(ast).code).toEqual(`<rax-text>{{
    _d0
  }}123</rax-text>`);
  });
});
