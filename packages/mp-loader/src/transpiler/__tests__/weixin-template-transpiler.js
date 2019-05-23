const babylon = require('babylon');
const createGenerate = require('../createGenerator');
const createParse = require('../createParser');
const { createAdapter } = require('../adapter');

createAdapter('weixin');
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

  it('wx:key', () => {
    const content = `
      <view wx:key="{{key}}"></view>
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

  it('wx:if', () => {
    const content = `
      <view wx:if="{{condition}}">IF</view>
      <view wx:elif="{{anotherCondition}}">ELSEIF</view>
      <view wx:else>ELSE</view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();

    const generated = generate(ast, transpilerOptions);
    expect(generated.render).toMatchSnapshot();
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

  it('test for scoped-slot', () => {
    const ast = parse(`
      <component bindtap="handler">
        <view slot="item" slot-scope="props">
          <text>{{props.item.text}}</text>
        </view>
      </component>
    `, transpilerOptions);

    expect(ast).toMatchSnapshot();
  });
});
