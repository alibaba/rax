const t = require('@babel/types');
const { _transformTemplate, _transformRenderFunction } = require('../condition');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').ali;
const genCode = require('../../codegen/genCode');
const genExpression = require('../../codegen/genExpression');

describe('Transform condition', () => {
  it('transform conditional expression in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual('<View><block a:if={foo}><View /></block><block a:else><Text /></block></View>');
  });

  it("transform conditional's consequent is conditional expression", () => {
    const ast = parseExpression(`
      <View>{foo ? bar ? <Bar /> : <View /> : <Text />}</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if={foo}><block a:if={bar}><Bar /></block><block a:else><View /></block></block><block a:else><Text /></block></View>');
  });

  it("transform condition's alternate is conditional expression", () => {
    const ast = parseExpression(`
      <View>{empty ? <Empty /> : loading ? null : 'xxx' }</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if={empty}><Empty /></block><block a:else><block a:if={loading}></block><block a:else>xxx</block></block></View>');
  });

  it('skip list dynamic value', () => {
    const ast = parseExpression(`
      <view className="content">
          {list.map(item => {
            return (
              <text>{item.type === 'FLOW_WALLET' ? 'M' : '¥'}</text>
            );
          })}
        </view>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(
      `<view className=\"content\">
          {list.map(item => {
    return <text><block a:if={item.type === 'FLOW_WALLET'}>M</block><block a:else>¥</block></text>;
  })}
        </view>`);
  });

  it('transform conditional expression with list', () => {
    const ast = parseExpression(`
      <View>
        { tabList ? tabList.map(tab => {
          return <View>{tab}</View>
        }) : 123 }
      </View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block a:if={tabList}>{tabList.map(tab => {
      return <View>{tab}</View>;
    })}</block><block a:else>123</block>
      </View>`);
  });

  it('transform simple logical expression', () => {
    const ast = parseExpression(`
      <View>
        { a && <View>1</View>}
      </View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block a:if={a}><View>1</View></block><block a:else>{a}</block>
      </View>`);
  });

  it('transform nested logical expression', () => {
    const ast = parseExpression(`
      <View>
        { a || b && <View>1</View>}
      </View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block a:if={!a}><block a:if={b}><View>1</View></block><block a:else>{b}</block></block><block a:else>{a}</block>
      </View>`);
  });

  it('transform logical expression with jsx', () => {
    const ast = parseExpression(`
      <View>
        { <View>1</View> && <View>2</View> }
        { <View>1</View> || <View>2</View> }
      </View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <View>2</View>
        <View>1</View>
      </View>`);
  });
});

describe('Transiform condition render function', () => {
  it('basic case', () => {
    const ast = parseExpression(`(function render(props) {
        let { a, b, ...c } = props;
        let vdom;
        if (a > 0) {
          vdom = <view>case 1</view>
        } else {
          vdom = <view>case 1.1</view>
        }
        if (a > 1) {
          vdom = <view>case 2</view>
        }
        return vdom;
      })
    `);

    const tmpVars = _transformRenderFunction(ast, adapter);
    expect(genExpression(tmpVars.vdom)).toEqual('<block><block a:if={a > 0}><view>case 1</view></block><block a:else><view>case 1.1</view></block><block a:if={a > 1}><view>case 2</view></block></block>');
    expect(genExpression(ast)).toEqual(`function render(props) {
  let {
    a,
    b,
    ...c
  } = props;
  let vdom;

  if (a > 0) {} else {}

  if (a > 1) {}

  return vdom;
}`);
  });

  it('without consequent body', () => {
    const ast = parseExpression(`(function render(props) {
        let { a, b, ...c } = props;
        let vdom;
        if (a > 0) {
          vdom = <view>case 1</view>
        } else {
          vdom = <view>case 1.1</view>
        }
        if (a > 1) vdom = <view>case 2</view>
        return vdom;
      })
    `);

    const tmpVars = _transformRenderFunction(ast, adapter);
    expect(genExpression(tmpVars.vdom)).toEqual('<block><block a:if={a > 0}><view>case 1</view></block><block a:else><view>case 1.1</view></block><block a:if={a > 1}><view>case 2</view></block></block>');
    expect(genExpression(ast)).toEqual(`function render(props) {
  let {
    a,
    b,
    ...c
  } = props;
  let vdom;

  if (a > 0) {} else {}

  if (a > 1) {}

  return vdom;
}`);
  });

  it('assign without jsx element', () => {
    const ast = parseExpression(`(function render(props) {
        let { a, b, ...c } = props;
        let vdom;
        if (a > 0) {
          vdom = 123;
          b = 2;
        } else {
          vdom = <view>case 1.1</view>
        }
        return vdom;
      })
    `);

    const tmpVars = _transformRenderFunction(ast, adapter);
    expect(genExpression(tmpVars.vdom)).toEqual('<block><block a:if={a > 0}>{123}</block><block a:else><view>case 1.1</view></block></block>');
    expect(genExpression(ast)).toEqual(`function render(props) {
  let {
    a,
    b,
    ...c
  } = props;
  let vdom;

  if (a > 0) {
    vdom = 123;
    b = 2;
  } else {}

  return vdom;
}`);
  });

  it('local variable and render value are the same', () => {
    const ast = parseExpression(`(function render(props) {
        const [a, setState] = useState(1);
        useEffect(() => {
          const { isLogin } = app;
          let a = 2;
          if (isLogin) {
            a = 3;
          }
          setState(a);
        }, [])
        return <View>{a}</View>;
      })
    `);

    const tmpVars = _transformRenderFunction(ast, adapter);
    expect(genExpression(tmpVars.vdom)).toEqual('');
    expect(genExpression(ast)).toEqual(`function render(props) {
  const [a, setState] = useState(1);
  useEffect(() => {
    const {
      isLogin
    } = app;
    let a = 2;

    if (isLogin) {
      a = 3;
    }

    setState(a);
  }, []);
  return <View>{a}</View>;
}`);
  });
});
