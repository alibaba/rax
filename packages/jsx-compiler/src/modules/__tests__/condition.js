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
});
