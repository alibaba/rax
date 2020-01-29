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
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={arr.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index},
      _d0: val,
      _d1: ${index}
    };
  })} a:for-item="val" a:for-index="${index}"><item data-value="{{val._d0}}" data-key="{{val._d1}}" /></block></View>`);
  });

  it('transform array.map in JSXContainer', () => {
    const code = `
    <View>{arr.map((val, idx) => {
      return <item data-value={val} data-key={idx} />
    })}</View>
  `;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={arr.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index},
      _d0: val,
      _d1: ${index}
    };
  })} a:for-item="val" a:for-index="${index}"><item data-value="{{val._d0}}" data-key="{{val._d1}}" /></block></View>`);
  });

  it('bind list variable', () => {
    const code = `
    <View>{arr.map((item, idx) => <View>{item.title}<image source={{ uri: item.picUrl }} resizeMode={resizeMode} /></View>)}</View>
  `;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={arr.map((item, ${index}) => {
    return {
      item: item,
      ${index}: ${index},
      _d0: {
        uri: item.picUrl
      },
      _d1: resizeMode
    };
  })} a:for-item="item" a:for-index="${index}"><View>{item.title}<image source="{{item._d0}}" resizeMode="{{item._d1}}" /></View></block></View>`);
  });

  it('list elements', () => {
    const code = `<View>{[1,2,3].map((val, idx) => {
      return <Text>{idx}</Text>;
    })}</View>`;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
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
    _transformList({
      templateAST: ast
    }, code, adapter);
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
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast, { concise: true }).code).toEqual(`<View><block a:for={[1, 2, 3].map((item, ${index}) => { return { item: item, ${index}: ${index} }; })} a:for-item="item" a:for-index="${index}"><Text>test</Text></block></View>`);
  });

  it('list style', () => {
    const code = `<View>{[1,2,3].map((item, index) => {
      const style = {
        height: index * 100 + 'rpx'
      }
      return <Text style={style}>test</Text>;
    })}</View>`;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={[1, 2, 3].map((item, ${index}) => {
    const style = {
      height: ${index} * 100 + 'rpx'
    };
    return {
      item: item,
      ${index}: ${index},
      _s0: __create_style__(style)
    };
  })} a:for-item="item" a:for-index="${index}"><Text style="{{item._s0}}">test</Text></block></View>`);
  });

  it('nested list style', () => {
    const code = `<View>
    {[
      [1, 2],
      [3, 4]
    ].map((item, index) => {
      return (
        <View>
          {item.map((it, idx) => {
            const style = {
              height: index * 100 + "rpx"
            };
            return <Text style={style}>{it}</Text>;
          })}
        </View>
      );
    })}
  </View>`;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index1 = 'index' + count++;
    const index2 = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View>
    <block a:for={[[1, 2], [3, 4]].map((item, ${index1}) => {
    return {
      item: item.map((it, ${index2}) => {
        const style = {
          height: ${index1} * 100 + "rpx"
        };
        return {
          it: it,
          ${index2}: ${index2},
          _s0: __create_style__(style)
        };
      }),
      ${index1}: ${index1}
    };
  })} a:for-item="item" a:for-index="${index1}"><View>
          <block a:for={item} a:for-item="it" a:for-index="${index2}"><Text style="{{it._s0}}">{it}</Text></block>
        </View></block>
  </View>`);
  });

  it("map function hasn't return", () => {
    const code = '<View>{[1,2,3].map((item, index) => (<Text>test</Text>))}</View>';
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block a:for={[1, 2, 3].map((item, ${index}) => {
    return {
      item: item,
      ${index}: ${index}
    };
  })} a:for-item="item" a:for-index="${index}"><Text>test</Text></block></View>`);
  });
});
