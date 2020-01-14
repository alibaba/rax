const t = require('@babel/types');
const { _transformTemplate, _transformRenderFunction } = require('../condition');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter').ali;
const genCode = require('../../codegen/genCode');
const genExpression = require('../../codegen/genExpression');

function genInlineCode(ast) {
  return genCode(ast, {
    comments: false, // Remove template comments.
    concise: true, // Reduce whitespace, but not to disable all.
  });
}

describe('Transform condition', () => {
  it('transform conditional expression in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><View /></block><block a:else><Text /></block></View>');
    expect(dynamicValue[0].name).toEqual('_i0');
    expect(dynamicValue[0].value.name).toEqual('foo');
  });

  it("transform conditional's consequent is conditional expression", () => {
    const ast = parseExpression(`
      <View>{foo ? bar ? <Bar /> : <View /> : <Text />}</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><block a:if="{{bar}}"><Bar /></block><block a:else><View /></block></block><block a:else><Text /></block></View>');
    expect(dynamicValue[0].name).toEqual('_i0');
    expect(dynamicValue[0].value.name).toEqual('bar');
    expect(dynamicValue[1].name).toEqual('_i1');
    expect(dynamicValue[1].value.name).toEqual('foo');
  });

  it("transform condition's alternate is conditional expression", () => {
    const ast = parseExpression(`
      <View>{empty ? <Empty /> : loading ? null : 'xxx' }</View>
    `);
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{empty}}"><Empty /></block><block a:else><block a:if="{{loading}}"></block><block a:else>xxx</block></block></View>');
    expect(dynamicValue[0].name).toEqual('_i0');
    expect(dynamicValue[0].value.name).toEqual('loading');
    expect(dynamicValue[1].name).toEqual('_i1');
    expect(dynamicValue[1].value.name).toEqual('empty');
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
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});
    expect(Object.keys(dynamicValue)).toEqual([]);
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
    const dynamicValue = _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block a:if="{{tabList}}">{tabList.map(tab => {
      return <View>{tab}</View>;
    })}</block><block a:else>123</block>
      </View>`);
    expect(dynamicValue[0].name).toEqual('_i0');
    expect(dynamicValue[0].value.name).toEqual('tabList');
  });

  it('transform simple logical expression', () => {
    const ast = parseExpression(`
      <View>
        { a && <View>1</View>}
      </View>
    `);
    _transformTemplate(ast, {}, adapter, {});
    expect(genCode(ast).code).toEqual(`<View>
        <block a:if="{{a}}"><View>1</View></block><block a:else>{a}</block>
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
        <block a:if={!a}><block a:if="{{b}}"><View>1</View></block><block a:else>{b}</block></block><block a:else>{a}</block>
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
});
