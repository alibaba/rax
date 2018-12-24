const { parse } = require('../parser');
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
  });

  it('a:for', () => {
    const content = `
      <view a:for="todos"></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();
  });

  it('should use a:for with other rules', () => {
    const content = `
      <view a:for="todos" a:key="{{item.id}}" checked="{{item.checked}}"></view>
    `;
    const ast = parse(content, transpilerOptions);
    expect(ast).toMatchSnapshot();
  });
});
