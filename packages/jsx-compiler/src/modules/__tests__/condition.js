const { _transformTemplate, _transformRenderFunction } = require('../condition');
const { parseExpression } = require('../../parser');
const adapter = require('../../adapter');
const genCode = require('../../codegen/genCode');
const genExpression = require('../../codegen/genExpression');

describe('Transform condition', () => {
  it('transform conditional expression in JSXContainer', () => {
    const ast = parseExpression(`
      <View>{foo ? <View /> : <Text />}</View>
    `);
    _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><View /></block><block a:else><Text /></block></View>');
  });

  it("transform conditional's consequent is conditional expression", () => {
    const ast = parseExpression(`
      <View>{foo ? bar ? <Bar /> : <View /> : <Text />}</View>
    `);
    _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{foo}}"><block a:if="{{bar}}"><Bar /></block><block a:else><View /></block></block><block a:else><Text /></block></View>');
  });

  it("transform condition's alternate is conditional expression", () => {
    const ast = parseExpression(`
      <View>{empty ? <Empty /> : loading ? null : 'xxx' }</View>
    `);
    _transformTemplate(ast, adapter, {});

    expect(genCode(ast).code).toEqual('<View><block a:if="{{empty}}"><Empty /></block><block a:else><block a:if="{{loading}}"></block><block a:else>xxx</block></block></View>');
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
    const dynamicValue = _transformTemplate(ast, adapter, {});
    expect(Object.keys(dynamicValue)).toEqual([]);
    expect(genCode(ast).code).toEqual('<view className="content">\n' +
      '          {list.map(item => {\n' +
      '    return <text><block a:if="{{item.type === \'FLOW_WALLET\'}}">M</block><block a:else>¥</block></text>;\n' +
      '  })}\n' +
      '        </view>');
  });
});

describe('Transiform condition render function', () => {
  it ('basic case', () => {
    const ast = parseExpression(`(function render() {
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
    expect(genExpression(tmpVars.vdom.value)).toEqual(`<block><block a:if="{{a > 0}}"><view>case 1</view></block><block a:else><view>case 1.1</view></block><block a:if="{{a > 1}}"><view>case 2</view></block></block>`);
    expect(genExpression(ast)).toEqual(`function render() {
  let vdom;
  return vdom;
}`);
  });
});


