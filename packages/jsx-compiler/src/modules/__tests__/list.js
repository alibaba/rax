const { _transformList } = require('../list');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').ali;
const genCode = require('../../codegen/genCode');

let count = 0;

describe('Transform list', () => {
  it('transform array.map in JSXContainer with inline return', () => {
    const code = `
    <View>{arr.map((val, idx) => <item data-value={val} data-key={idx} />)}</View>
  `;
    const ast = parseExpression(code);
    _transformList(ast, [], code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={arr.map((val, ${index}) => ({
    val: val,
    ${index}: ${index}
  }))} a:for-item="val" a:for-index="${index}"><item data-value={val} data-key={${index}} /></block></View>`);
  });

  it('transform array.map in JSXContainer', () => {
    const code = `
    <View>{arr.map((val, idx) => {
      return <item data-value={val} data-key={idx} />
    })}</View>
  `;
    const ast = parseExpression(code);
    _transformList(ast, [], code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={arr.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index}
    };
  })} a:for-item="val" a:for-index="${index}"><item data-value={val} data-key={${index}} /></block></View>`);
  });

  it('bind list variable', () => {
    const code = `
    <View>{arr.map((item, idx) => <View>{item.title}<image source={{ uri: item.picUrl }} resizeMode={resizeMode} /></View>)}</View>
  `;
    const ast = parseExpression(code);
    _transformList(ast, [], code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={arr.map((item, ${index}) => ({
    item: item,
    ${index}: ${index}
  }))} a:for-item="item" a:for-index="${index}"><View>{item.title}<image source={{
        uri: item.picUrl
      }} resizeMode={resizeMode} /></View></block></View>`);
  });

  it('list elements', () => {
    const code = `<View>{[1,2,3].map((val, idx) => {
      return <Text>{idx}</Text>;
    })}</View>`;
    const ast = parseExpression(code);
    _transformList(ast, [], code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast, { concise: true }).code).toEqual(`<View><block a:for={[1, 2, 3].map((val, ${index}) => { return { val: val, ${index}: ${index} }; })} a:for-item="val" a:for-index="${index}"><Text>{${index}}</Text></block></View>`);
  });

  it('nested list', () => {
    const code = `
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
    const ast = parseExpression(code);
    _transformList(ast, [], code, adapter);
    const index1 = 'index' + count++;
    const index2 = 'index' + count++;
    expect(genCode(ast, { concise: true }).code).toEqual(`<View className="header" onClick={() => { setWorkYear(workYear + 1); }}>
  <View style={{ color: 'red' }}>workYear: {workYear}</View>
  <View style={{ color: 'red' }}>count: {count}</View>
  <block a:for={arr.map((l1, ${index1}) => { return { l1: l1.map((l2, ${index2}) => { return { l2: l2, ${index2}: ${index2} }; }), ${index1}: ${index1} }; })} a:for-item="l1" a:for-index="${index1}"><View>
        <block a:for={l1} a:for-item="l2" a:for-index="${index2}"><View>{l2}</View></block>
      </View></block>
  <Loading count={count} />
  {props.children}
</View>`);
  });

  it('list default params', () => {
    const code = `<View>{[1,2,3].map(() => {
      return <Text>test</Text>;
    })}</View>`;
    const ast = parseExpression(code);
    _transformList(ast, [], code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast, { concise: true }).code).toEqual(`<View><block a:for={[1, 2, 3].map((item, ${index}) => { return { item: item, ${index}: ${index} }; })} a:for-item="item" a:for-index="${index}"><Text>test</Text></block></View>`);
  });
});
