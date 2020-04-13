const { _transformList } = require('../list');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
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
    expect(genCode(ast).code).toEqual(`<View><block for={arr.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index}
    };
  })} a:for-item="val" a:for-index="${index}"><item data-value="{{val.val}}" data-key="{{val.${index}}}" /></block></View>`);
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
    expect(genCode(ast).code).toEqual(`<View><block for={arr.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index}
    };
  })} a:for-item="val" a:for-index="${index}"><item data-value="{{val.val}}" data-key="{{val.${index}}}" /></block></View>`);
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
    expect(genCode(ast).code).toEqual(`<View><block for={arr.map((item, ${index}) => {
    return {
      item: item,
      ${index}: ${index},
      d0: item.title,
      d1: {
        uri: item.picUrl
      }
    };
  })} a:for-item="item" a:for-index="${index}"><View>{{
        item.d0
      }}<image source="{{item.d1}}" resizeMode={resizeMode} /></View></block></View>`);
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
    expect(genCode(ast, { concise: true }).code).toEqual(`<View><block for={[1, 2, 3].map((val, ${index}) => { return { val: val, ${index}: ${index} }; })} a:for-item="val" a:for-index="${index}"><Text>{{ val.${index} }}</Text></block></View>`);
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
    expect(genCode(ast).code).toEqual(`<View className="header" onClick={() => {
  setWorkYear(workYear + 1);
}}>
  <View style={{
    color: 'red'
  }}>workYear: {workYear}</View>
  <View style={{
    color: 'red'
  }}>count: {count}</View>
  <block for={arr.map((l1, ${index1}) => {
    return {
      l1: l1.map((l2, ${index2}) => {
        return {
          l2: l2,
          ${index2}: ${index2}
        };
      }),
      ${index1}: ${index1}
    };
  })} a:for-item="l1" a:for-index="${index1}"><View>
        <block for={l1} a:for-item="l2" a:for-index="${index2}"><View>{{
            l2.l2
          }}</View></block>
      </View></block>
  <Loading count={count} />
  {props.children}
</View>`);
  });

  it('nested list without relation', () => {
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
        {list[l1].map(l2 => {
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
    expect(genCode(ast).code).toEqual(`<View className="header" onClick={() => {
  setWorkYear(workYear + 1);
}}>
  <View style={{
    color: 'red'
  }}>workYear: {workYear}</View>
  <View style={{
    color: 'red'
  }}>count: {count}</View>
  <block for={arr.map((l1, ${index1}) => {
    return {
      l1: l1,
      ${index1}: ${index1},
      d0: list[l1].map((l2, ${index2}) => {
        return {
          l2: l2,
          ${index2}: ${index2}
        };
      })
    };
  })} a:for-item="l1" a:for-index="${index1}"><View>
        <block for={d0} a:for-item="l2" a:for-index="${index2}"><View>{{
            l2.l2
          }}</View></block>
      </View></block>
  <Loading count={count} />
  {props.children}
</View>`);
  });

  it('nested list with item property', () => {
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
        {l1.list.map(l2 => {
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
    expect(genCode(ast).code).toEqual(`<View className="header" onClick={() => {
  setWorkYear(workYear + 1);
}}>
  <View style={{
    color: 'red'
  }}>workYear: {workYear}</View>
  <View style={{
    color: 'red'
  }}>count: {count}</View>
  <block for={arr.map((l1, ${index1}) => {
    return {
      l1: { ...l1,
        list: l1.list.map((l2, ${index2}) => {
          return {
            l2: l2,
            ${index2}: ${index2}
          };
        })
      },
      ${index1}: ${index1}
    };
  })} a:for-item="l1" a:for-index="${index1}"><View>
        <block for={l1.list} a:for-item="l2" a:for-index="${index2}"><View>{{
            l2.l2
          }}</View></block>
      </View></block>
  <Loading count={count} />
  {props.children}
</View>`);
  });

  it('nested list with temp variable in first list', () => {
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
    const a = l1 || [];
    return (
      <View>
        {a.map(l2 => {
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
    expect(genCode(ast).code).toEqual(`<View className="header" onClick={() => {
  setWorkYear(workYear + 1);
}}>
  <View style={{
    color: 'red'
  }}>workYear: {workYear}</View>
  <View style={{
    color: 'red'
  }}>count: {count}</View>
  <block for={arr.map((l1, ${index1}) => {
    const a = l1 || [];
    return {
      l1: l1,
      ${index1}: ${index1},
      a: a.map((l2, ${index2}) => {
        return {
          l2: l2,
          ${index2}: ${index2}
        };
      })
    };
  })} a:for-item="l1" a:for-index="${index1}"><View>
        <block for={a} a:for-item="l2" a:for-index="${index2}"><View>{{
            l2.l2
          }}</View></block>
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
    expect(genCode(ast, { concise: true }).code).toEqual(`<View><block for={[1, 2, 3].map((item, ${index}) => { return { item: item, ${index}: ${index} }; })} a:for-item="item" a:for-index="${index}"><Text>test</Text></block></View>`);
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
    expect(genCode(ast).code).toEqual(`<View><block for={[1, 2, 3].map((item, ${index}) => {
    const style = {
      height: ${index} * 100 + 'rpx'
    };
    return {
      item: item,
      ${index}: ${index},
      s0: __create_style__(style)
    };
  })} a:for-item="item" a:for-index="${index}"><Text style="{{item.s0}}">test</Text></block></View>`);
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
    <block for={[[1, 2], [3, 4]].map((item, ${index1}) => {
    return {
      item: item.map((it, ${index2}) => {
        const style = {
          height: ${index1} * 100 + "rpx"
        };
        return {
          it: it,
          ${index2}: ${index2},
          s0: __create_style__(style)
        };
      }),
      ${index1}: ${index1}
    };
  })} a:for-item="item" a:for-index="${index1}"><View>
          <block for={item} a:for-item="it" a:for-index="${index2}"><Text style="{{it.s0}}">{{
            it.it
          }}</Text></block>
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
    expect(genCode(ast).code).toEqual(`<View><block for={[1, 2, 3].map((item, ${index}) => {
    return {
      item: item,
      ${index}: ${index}
    };
  })} a:for-item="item" a:for-index="${index}"><Text>test</Text></block></View>`);
  });

  it('use expression in map fn', () => {
    const code = `<View>{[1,2,3].map((item, index) => {
      const a = index * 2 + 10;
      return <Text>{a}</Text>;
    })}</View>`;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block for={[1, 2, 3].map((item, ${index}) => {
    const a = ${index} * 2 + 10;
    return {
      item: item,
      ${index}: ${index},
      d0: a
    };
  })} a:for-item="item" a:for-index="${index}"><Text>{{
        item.d0
      }}</Text></block></View>`);
  });

  it('use format function in loop', () => {
    const code = `
    <View>{arr.map((val, idx) => {
      return <View data-value={val} data-key={idx}>{format(idx)}</View>
    })}</View>
  `;
    const ast = parseExpression(code);
    _transformList({
      templateAST: ast
    }, code, adapter);
    const index = 'index' + count++;
    expect(genCode(ast).code).toEqual(`<View><block for={arr.map((val, ${index}) => {
    return {
      val: val,
      ${index}: ${index},
      d0: format(${index})
    };
  })} a:for-item="val" a:for-index="${index}"><View data-value="{{val.val}}" data-key="{{val.${index}}}">{{
        val.d0
      }}</View></block></View>`);
  });
});
