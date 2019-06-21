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

    expect(genCode(ast).code).toEqual('<View><block a:for="{{arr}}" a:for-item="val" a:for-index="idx"><item data-value="{{val}}" data-key="{{idx}}" /></block></View>');
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

  it('bind loop variable', () => {
    const ast = parseExpression(`
      <View>{arr.map((item, idx) => <image source={{ uri: item.picUrl }} resizeMode={resizeMode} />)}</View>
    `);
    _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual('<View><block a:for="{{arr}}" a:for-item="item" a:for-index="idx"><image source="{{ uri: item.picUrl }}" resizeMode={resizeMode} /></block></View>');
  });

  it('bind loop item', () => {
    const raw = `<View class="coupon-list">{
        couponList.map(coupon => <Coupon coupon={coupon} onClick={this.handleClick.bind(this, coupon)} />)
      }</View>`;
    const ast = parseExpression(raw);
    _transformList(ast, adapter);
    expect(genCode(ast).code).toEqual('<View class="coupon-list"><block a:for="{{couponList}}" a:for-item="coupon" a:for-index="index"><Coupon coupon="{{coupon}}" onClick={this.handleClick} data-arg-context="this" data-arg-0="{{coupon}}" /></block></View>');
  });

  it('loop elements', () => {
    const raw = `<View>{[1,2,3].map((val, idx) => {
      return <Text>{idx}</Text>;
    })}</View>`;
    const ast = parseExpression(raw);
    _transformList(ast, adapter);
    expect(genCode(ast, { concise: true }).code).toEqual('<View><block a:for="{{[1, 2, 3]}}" a:for-item="val" a:for-index="idx"><Text>{{ idx }}</Text></block></View>');
  });
});
