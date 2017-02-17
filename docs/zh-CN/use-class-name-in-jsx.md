# 在 JSX 中使用 className

使用 CSS 已经非常方便，但我们觉得可以往标准更进一步，我们实现了在 JSX 中可以直接使用 className，更进一步提升书写样式的开发体验。

## 引入 className

CSS 的写法和上篇一中介绍的一样并没有变化，主要变化出现在 JS 中:

```js
import './foo.css';

function Foo() {
  return <div className="container">
    <span className="container_title">hello world</span>
  </div>;
}

export default Foo;
```

和之前主要有两个不同点：

1. 不用再引入 styles 变量了
2. JSX 中 style 属性变成 className，值改成字符串的形式

## 配置

使用上述特性必须安装 `babel-plugin-transform-jsx-stylesheet` 插件

```sh
npm install --save-dev babel-plugin-transform-jsx-stylesheet
```

并且在所在项目的 `.babelrc` 加入以下配置：

```json
{
  "plugins": ["transform-jsx-stylesheet"]
}
```

更多细节查看[babel-plugin-transform-jsx-stylesheet](https://github.com/alibaba/rax/blob/master/packages/babel-plugin-transform-jsx-stylesheet/README.md)
