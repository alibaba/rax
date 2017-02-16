#  在项目中使用 css

对于 Rax 样式最佳实践，我们推荐使用官方提供的 [stylesheet-loader](https://github.com/alibaba/rax/blob/master/packages/stylesheet-loader/README.md)。这个 loader 允许在项目中写 css，通过在 webpack 中配置不同的预处理器 loader 也可以写 less 或 sass。

## 配置

### 安装 loader

```
npm install --save-dev stylesheet-loader
```

在 `webpack.config.js` 中配置:
```js
module.export = {
  module: {
    loaders: [
      {
        test: /\.css$/,
        loader: 'stylesheet'
      }
    ]
  }
};
```

## 如何使用

创建一个 css，`foo.css`:
```css
.container {
  background-color: blue;
}

.container_title {
  font-size: 20px;
}
```

创建一个 js，`foo.js`:
```js
import styles from './foo.css';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title}>hello world</span>
  </div>;
}

export default Foo;
```

## 支持的特性

### font-face

我们可以在项目中使用 `FontFace`。举个例子，我想要使用 iconfont，应该怎么做呢？

首先在 css 中定义一个 font-face:
```css
@font-face {
  font-family: icon;
  src: url(http://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf);
}

.text {
  font-family: icon;
}
```

然后我们就可以在 jsx 中使用字体了:
```js
<span style={styles.text}>{'\uE601'}</span>
```

### 群组选择器

我们支持在 css 选择器中写群组选择器

```css
.a, .b {
  color: red;
}
```

### 继承

`stylesheet-loader` 默认不支持嵌套规则，如果你在 css 中写了类似 `.a .b` 这样的选择器 ，我们会跳过这个规则并且抛出错误。

但你可以通过在 webpack 中配置 `transformDescendantCombinator` 支持嵌套:
```js
{
  test: /\.css/,
  loader: 'stylesheet?transformDescendantCombinator'
}
```

这种嵌套的规则最终会转成下划线连接的变量，比如 `.a .b` 会转成 `a_b`。

### 媒体查询

等同于 [css 媒体查询](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)，但类型我们只支持了 `screen`.

```css
@media screen and (min-width: 480px) {
  .title {
    font-size: 25rem;
  }
}
```

### 伪类

伪类的使用等同于 [css-pseudo](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)，但支持的伪类类型有限，目前只支持以下几种：

* `:active`
* `:focus`
* `:disabled`
* `:enabled`

## 校验

如果用户输入的样式有问题，我们会在命令行或者浏览器控制台警告，当然为了性能考虑浏览器控制台的警告仅限于 development 模式下。

<p align="center">
  <img alt="stylesheet validation" src="https://gw.alicdn.com/tfs/TB1EHgXPXXXXXc3XVXXXXXXXXXX-1324-208.png" width="400">
</p>

