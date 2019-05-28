const { _transformList } = require('../list');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter');
const genCode = require('../../codegen/genCode');

describe('Transform list', () => {
  it('transform array.map in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => <item data-value={val} data-key={idx} />)}</View>
    `);
    _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual('<View><block a:for="{{arr}}" a:for-item="val" a:for-index="idx"><item data-value={val} data-key={idx} /></block></View>');
  });
});
