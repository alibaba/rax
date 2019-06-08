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

  it('bind props', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => <item
        onClick={props.onClick.bind(this, item, 1)}
      />)}</View>
    `);
    _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual('<View><block a:for="{{arr}}" a:for-item="val" a:for-index="idx"><item onClick={props.onClick} data-arg-context="this" data-arg-0="{{item}}" data-arg-1="{{1}}" /></block></View>');
  });
});
