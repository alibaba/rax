const { _transformTag } = require('../tag');
const { parseExpression } = require('../../parser/index');
const genCode = require('../../codegen/genCode');

describe('Transform tag', () => {
  it('view add text', () => {
    const ast = parseExpression(`
      <rax-view>
        hello
      </rax-view>
    `);
    _transformTag(ast);
    expect(genCode(ast).code).toEqual(`<rax-view><text>
        hello
      </text></rax-view>`);
  });
  it('link add text', () => {
    const ast = parseExpression(`
      <rax-link>
        hello
      </rax-link>
    `);
    _transformTag(ast);
    expect(genCode(ast).code).toEqual(`<rax-link><text>
        hello
      </text></rax-link>`);
  });
  it('view expression add text', () => {
    const ast = parseExpression(`
      <rax-view>
        {item.name}
      </rax-view>
    `);
    _transformTag(ast);
    expect(genCode(ast).code).toEqual(`<rax-view>
        <text>{item.name}</text>
      </rax-view>`);
  });
  it('view expression add text', () => {
    const ast = parseExpression(`
      <rax-link>
        {item.name}
      </rax-link>
    `);
    _transformTag(ast);
    expect(genCode(ast).code).toEqual(`<rax-link>
        <text>{item.name}</text>
      </rax-link>`);
  });
});