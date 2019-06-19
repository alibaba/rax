const babylon = require('babylon');
const createGenerate = require('../createGenerator');
const createParse = require('../createParser');
const { createAdapter } = require('../adapter');

createAdapter();
const modules = require('../transformModules');

const generate = createGenerate(modules);
const parse = createParse(modules);
const transpilerOptions = { modules: modules };
/**
 * Check whether a js string is valid.
 */
function checkValidJavaScriptStr(str) {
  try {
    babylon.parseExpression(str, {
      allowImportExportEverywhere: true,
      plugins: ['objectRestSpread'],
    });
  } catch (err) {
    return false;
  }
  return true;
}

describe('Transpiler parse', () => {
  it('nested', () => {
    const content = `
      <view foo="bar">
        <text>hello</text>
        <text>world</text>
      </view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('bind props', () => {
    const content = `
      <view foo="bar {{someVal}} {{otherVal}}">
        <text>hello</text>
        <text>world</text>
      </view>
    `;

    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('a:key', () => {
    const content = `
      <view a:key="{{key}}"></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('style and class', () => {
    const content = `
      <view style="color: red; {{style}}" class="staticClass {{dynamicClass}}"></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });


  it('a:if', () => {
    const content = `
      <view a:if="{{condition}}">IF</view>
      <view a:elif="{{anotherCondition}}">ELSEIF</view>
      <view a:else>ELSE</view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('a:for', () => {
    const content = `
      <view a:for="todos"></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('a:for with a:if and a:key', () => {
    const content = `
      <view
        a:key="{{item.id}}"
        a:for="todos"
        a:if="{{item.checked}}"
        checked="{{item.checked}}"
      ></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('should use a:for with other rules', () => {
    const content = `
      <view a:for="todos" a:key="{{item.id}}" checked="{{item.checked}}"></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
  });

  it('should parse instant array expression', () => {
    const content = `
      <single-item
        a:for="{{[{},{},{},{}]}}"
        empty="{{1}}"></single-item>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(checkValidJavaScriptStr(generated.render)).toBe(true);
    expect(generated).toMatchSnapshot();
  });

  it('should parse instant nested object expression', () => {
    const content = `
      <view foo="{{x:{y:2}}}"></view>
    `;
    const ast = parse(content, transpilerOptions);
    const generated = generate(ast, transpilerOptions);
    expect(checkValidJavaScriptStr(generated.render)).toBe(true);
    expect(generated).toMatchSnapshot();
  });

  it('expression with special chars', () => {
    const content = `
      <template a:if="{{orderData.operationConfirm}}" data="{{
        btnText: defaultData.confirm,
        action: 'confirmOrder',
        btnType: btnType.green
      }}">
      </template>
      <view
        data-info="{{item.name}},{{item.order_item_id}}"
      ></view>
    `;
    const ast = parse(content, transpilerOptions);
    const generated = generate(ast, transpilerOptions);
    expect(checkValidJavaScriptStr(generated.render)).toBe(true);
    expect(generated).toMatchSnapshot();
  });

  it('test for scoped-slot', () => {
    const ast = parse(`
      <component onTap="handler">
        <view slot="item" slot-scope="props">
          <text>{{props.item.text}}</text>
        </view>
      </component>
    `, transpilerOptions);

    expect(ast).toMatchSnapshot();
  });
});
