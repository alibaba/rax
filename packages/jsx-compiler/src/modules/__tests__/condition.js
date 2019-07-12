const { _transformTemplate, _transformRenderFunction } = require('../condition');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter');
const genCode = require('../../codegen/genCode');

describe('Transform condition', () => {
  it('transform conditional expression in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><View /></block><block a:else><Text /></block></View>');
  });

  it("transform conditional's consequent is conditional expression", () => {
    const ast = parseExpression(`
      <View>{foo ? bar ? <Bar /> : <View /> : <Text />}</View>
    `);
    _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><block a:if="{{bar}}"><Bar /></block><block a:else><View /></block></block><block a:else><Text /></block></View>');
  });

  it("transform condition's alternate is conditional expression", () => {
    const ast = parseExpression(`
      <View>{empty ? <Empty /> : loading ? null : 'xxx' }</View>
    `);
    _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{empty}}"><Empty /></block><block a:else><block a:if="{{loading}}"></block><block a:else>xxx</block></block></View>')
    ;
  it('transform conditional expression in JSXContainer2', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    const { dynamicValue } = _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><View /></block><block a:else><Text /></block></View>');
    expect(Object.keys(dynamicValue)).toEqual(['foo']);
  });
});


