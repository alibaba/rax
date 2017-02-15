
# 样式最佳实践二

最佳实践往往不止一个，这里会介绍一种相对于[一](https://github.com/alibaba/rax/blob/master/docs/cn/stylesheet-1.md)更方便的形式，首先来看下例子。

## 引入 className

css 的写法和上篇一中介绍的一样并没有变化，主要变化出现在 js 中

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
2. jsx 中 style 属性变成 className，值改成字符串的形式

## 配置

使用上述特性必须安装 `babel-plugin-jsx-stylesheet` 插件

```sh
npm install --save-dev babel-plugin-jsx-stylesheet
```

并且在所在项目的 `.babelrc` 加入以下配置：

```json
{
  "plugins": ["jsx-stylesheet"]
}
```
