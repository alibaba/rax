const t = require('@babel/types');
const { _transformList } = require('../list');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter');
const genCode = require('../../codegen/genCode');

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

function genDynamicAttrs(dynamicValue) {
  const properties = [];
  Object.keys(dynamicValue).forEach((key) => {
    properties.push(t.objectProperty(t.identifier(key), dynamicValue[key]));
  });
  return genInlineCode(t.objectExpression(properties)).code;
}

describe('Transform list', () => {
  it('transform array.map in JSXContainer with inline return', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => <item data-value={val} data-key={idx} />)}</View>
    `);
    const { dynamicValue } = _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual('<View><block a:for="{{_l0}}" a:for-item="_item0" a:for-index="_index0"><item data-value={_item0.val} data-key={_item0.idx} /></block></View>');
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: arr.map((val, idx) => ({ val: val, idx: idx })) }');
  });

  it('transform array.map in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => {
        return <item data-value={val} data-key={idx} />
      })}</View>
    `);
    const { dynamicValue } = _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual( '<View><block a:for="{{_l0}}" a:for-item="_item0" a:for-index="_index0"><item data-value={_item0.val} data-key={_item0.idx} /></block></View>');
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: arr.map((val, idx) => { return { val: val, idx: idx }; }) }');
  });

  it('bind props', () => {
    const ast = parseExpression(`
      <View>{arr.map((val, idx) => <item
        onClick={props.onClick.bind(this, val, 1)}
      />)}</View>
    `);
    const { dynamicValue } = _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual('<View><block a:for="{{_l0}}" a:for-item="_item0" a:for-index="_index0"><item onClick={props.onClick} data-arg-context="this" data-arg-0={_item0.val} data-arg-1={1} /></block></View>');
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: arr.map((val, idx) => ({ val: val, idx: idx })) }');
  });

  it('bind list variable', () => {
    const ast = parseExpression(`
      <View>{arr.map((item, idx) => <View>{item.title}<image source={{ uri: item.picUrl }} resizeMode={resizeMode} /></View>)}</View>
    `);
    const { dynamicValue } = _transformList(ast, adapter);

    expect(genCode(ast).code).toEqual(`<View><block a:for=\"{{_l0}}\" a:for-item=\"_item0\" a:for-index=\"_index0\"><View>{_item0.item.title}<image source={{
        uri: _item0.item.picUrl
      }} resizeMode={resizeMode} /></View></block></View>`);
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: arr.map((item, idx) => ({ item: item, idx: idx })) }');
  });

  it('bind list item', () => {
    const raw = `<View class="coupon-list">{
        couponList.map(coupon => <Coupon coupon={coupon} onClick={this.handleClick.bind(this, coupon)} />)
      }</View>`;
    const ast = parseExpression(raw);
    const { dynamicValue } = _transformList(ast, adapter);
    expect(genCode(ast).code).toEqual('<View class="coupon-list"><block a:for="{{_l0}}" a:for-item="_item0" a:for-index="_index0"><Coupon coupon={_item0.coupon} onClick={this.handleClick} data-arg-context="this" data-arg-0={_item0.coupon} /></block></View>');
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: couponList.map(coupon => ({ coupon: coupon })) }');
  });

  it('list elements', () => {
    const raw = `<View>{[1,2,3].map((val, idx) => {
      return <Text>{idx}</Text>;
    })}</View>`;
    const ast = parseExpression(raw);
    const { dynamicValue } = _transformList(ast, adapter);

    expect(genCode(ast, { concise: true }).code).toEqual('<View><block a:for="{{_l0}}" a:for-item="_item0" a:for-index="_index0"><Text>{_item0.idx}</Text></block></View>');
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: [1, 2, 3].map((val, idx) => { return { val: val, idx: idx }; }) }');
  });

  it('nested list', () => {
    const raw = `
<View
  className="header"
  onClick={() => {
    setWorkYear(workYear + 1);
  }}
>
  <View style={{ color: 'red' }}>workYear: {workYear}</View>
  <View style={{ color: 'red' }}>count: {count}</View>
  {arr.map(l1 => {
    return (
      <View>
        {l1.map(l2 => {
          return <View>{l2}</View>;
        })}
      </View>
    );
  })}
  <Loading count={count} />
  {props.children}
</View>`;
    const ast = parseExpression(raw);
    const { dynamicValue } = _transformList(ast, adapter);

    expect(genCode(ast, { concise: true }).code).toEqual(`<View className="header" onClick={() => { setWorkYear(workYear + 1); }}>
  <View style={{ color: 'red' }}>workYear: {workYear}</View>
  <View style={{ color: 'red' }}>count: {count}</View>
  <block a:for="{{_l0}}" a:for-item="_item0" a:for-index="_index0"><View>
        <block a:for="{{_item0._l1}}" a:for-item="_item1" a:for-index="_index1"><View>{_item1.l2}</View></block>
      </View></block>
  <Loading count={count} />
  {props.children}
</View>`);
    expect(genDynamicAttrs(dynamicValue)).toEqual('{ _l0: arr.map(l1 => { return { l1: l1, _l1: l1.map(l2 => { return { l2: l2 }; }) }; }) }');
  });
});
