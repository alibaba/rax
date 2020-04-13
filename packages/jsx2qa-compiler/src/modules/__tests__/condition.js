const t = require('@babel/types');
const { _transformTemplate, _transformRenderFunction } = require('../condition');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').quickapp;
const genCode = require('../../codegen/genCode');
const genExpression = require('../../codegen/genExpression');

describe('Transform condition', () => {
  it('transform conditional expression in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual('<View><block if={foo}><View /></block><block else><Text /></block></View>');
  });

  it("transform conditional's consequent is conditional expression", () => {
    const ast = parseExpression(`
      <View>{foo ? bar ? <Bar /> : <View /> : <Text />}</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block if={foo}><block if={bar}><Bar /></block><block else><View /></block></block><block else><Text /></block></View>');
  });

  it("transform condition's alternate is conditional expression", () => {
    const ast = parseExpression(`
      <View>{empty ? <Empty /> : loading ? null : 'xxx' }</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});

    expect(genCode(ast).code).toEqual('<View><View if={empty}><Empty /></View><View else><View if={loading}></View><View else>xxx</View></View></View>');
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
    return <text><View if={item.type === 'FLOW_WALLET'}>M</View><View else>¥</View></text>;
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
        <View if={tabList}>{tabList.map(tab => {
      return <View>{tab}</View>;
    })}</View><View else>123</View>
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
        <block if={a}><View>1</View></block><block else>{a}</block>
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
        <block if={!a}><block if={b}><View>1</View></block><block else>{b}</block></block><block else>{a}</block>
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
    expect(genExpression(tmpVars.vdom)).toEqual('<block><block if={a > 0}><view>case 1</view></block><block else><view>case 1.1</view></block><block if={a > 1}><view>case 2</view></block></block>');
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
    expect(genExpression(tmpVars.vdom)).toEqual('<block><block if={a > 0}><view>case 1</view></block><block else><view>case 1.1</view></block><block if={a > 1}><view>case 2</view></block></block>');
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
    expect(genExpression(tmpVars.vdom)).toEqual('<block><block if={a > 0}>{123}</block><block else><view>case 1.1</view></block></block>');
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
