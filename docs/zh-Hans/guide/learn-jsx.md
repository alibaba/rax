# 学习JSX

### 为什么要学习 JSX？

熟悉 React 的同学一定对 JSX 不陌生，Rax 的 DSL 语法是基于 React JSX 语法而创造。与 React 不同，在 Rax 中 JSX 是必选的，它不支持通过其它方式创建组件，所以学习 JSX 是使用 Rax 的必要基础。

> 如果你已经熟悉 React 的 JSX 语法，可以选择跳过阅读以下部分。

### 什么是 JSX？

JSX 是一个看起来很像 XML 的 JavaScript 语法扩展。 它只是一种语法糖。

它是类似 HTML 标签的表达式：

```jsx
<View style={styles.text}>
    <Text style={styles.title}>
      MAKE IT EASY TO DO BUSINESS ANYWHERE
    </Text>
    <Text style={styles.subtitle}>
      We aim to build the future infrastructure of commerce.
    </Text>
</View>
```

标签支持自闭合：

```jsx
<View />
```

### JSX 的含义

JSX 只是 JavaScript 语法的一个语法映射。 JSX 表达式执行函数调用，我们可以看成他就是调用 createElement() 方法的快捷方式。
Babel 内置的支持  JSX 语法的编译。在代码中声明 `@jsx`可以定制相应的函数调用：

```jsx
// Tell Babel to transform JSX into createElement() calls: 
/* @jsx createElement */
 
import { createElement } from 'rax';
 
<View /> // => createElement(View) 
```

除了在代码中声明，我们可以通过在 `.babelrc` 中进行配置来达到相同的目的：

```json
{
  "presets": ["es2015", "stage-1", "react"],
  "plugins": [
    ["transform-react-jsx", {
      "pragma": "createElement"
    }]
  ]
}
```

配置还可以简化为直接使用  [`babel-preset-rax`](https://github.com/alibaba/rax/tree/master/packages/babel-preset-rax) ：

```json
{
  "presets": ["es2015", "stage-1", "rax"]
}
```

### 更多参考

- [React Displaying Data](https://facebook.github.io/react/docs/displaying-data.html)
- [React JSX In Depth](https://facebook.github.io/react/docs/jsx-in-depth.html)
- [React JSX Spread](https://facebook.github.io/react/docs/jsx-spread.html)
- [Reac JSX Gotchas](https://facebook.github.io/react/docs/jsx-gotchas.html)
