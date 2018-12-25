const { parse } = require('../parser');
const generate = require('../generate');
const modules = require('../transpileModules');

const transpilerOptions = { modules };

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
});
