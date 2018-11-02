# Flexbox 和样式

## 内联方式

在 Rax 中，我们可以利用 js 定义样式，每个组件都支持一个 style 属性，用来定义组件的样式。

比如像这样：

```jsx
<View style={styles.container}>
  <Text>hello world</Text>
</View>

const styles = {
  container: {
    background: 'grey',
    width: '750rem'
  }
};
```

注意，在使用内联方式时，CSS 属性名只允许使用**驼峰**风格，不支持使用中划线。

当我们想要抽离通用样式，做复杂的样式处理时，style 对象中也可以是一个数组：

```jsx
<View style={[styles.container, styles.custom]}>
  <Text>hello world</Text>
</View>

const styles = {
  container: {
    background: 'grey',
    width: '750rem'
  },
  custom: {
    height: '100rem'
  }
};
```

## 使用 Flexbox

我们依旧可以延续以前的 web 样式的风格，但我相信大家可能会更喜欢 flexbox 大法。 
事实上，在 [facebook/css-layout](https://github.com/facebook/css-layout#supported-attributes) 中所支持的属性， Rax 都支持。 它们最后都会被 Rax 的样式转换器转换为内联的样式。  

## 样式定义中的单位规范

我们推荐使用不加单位的写法：

```jsx
<View style={styles.container}>
  <Text>hello world</Text>
</View>

const styles = {
  container: {
    background: 'grey',
    width: 375
  }
};
```

> 1 个单位的大小为屏幕宽度的 1/750，这样做的好处是当你拿到一份 750px 宽的视觉稿，你再也不需要去做人工换算。

## 在 Rax 中使用 CSS

Rax 支持直接书写 css 样式，并且我们更推荐这种写法。

#### 如何使用

创建一个 CSS 文件 `foo.css`:
```css
.container {
  background-color: blue;
}

.container_title {
  font-size: 20px;
}
```

创建一个 JS 文件 `foo.js`:

```jsx
import styles from './foo.css';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title}>hello world</span>
  </div>;
}

export default Foo;
```

### Rax CSS 支持的特性

Rax 中并不支持所有的 CSS 特性 ，下面列举了已经实现的功能。

#### font-face

我们可以在项目中使用 `FontFace`。举个例子，我想要使用 iconfont，应该怎么做呢？

首先在 CSS 中定义一个 font-face:

```css
@font-face {
  font-family: icon;
  src: url(//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf);
}

.text {
  font-family: icon;
}
```

然后我们就可以在 JSX 中使用字体了:

```jsx
<span style={styles.text}>{'\uE601'}</span>
```

> 仅支持 Rax 0.2.x 以上

#### 群组选择器

我们支持在 CSS 选择器中写群组选择器

```css
.a, .b {
  color: red;
}
```

#### 继承

`stylesheet-loader` 默认不支持嵌套规则，如果你在 CSS 中写了类似 `.a .b` 这样的选择器 ，我们会跳过这个规则并且抛出错误。

但你可以通过在 webpack 中配置 `transformDescendantCombinator` 支持嵌套:

```js
{
  test: /\.css/,
  loader: 'stylesheet?transformDescendantCombinator'
}
```

这种嵌套的规则最终会转成下划线连接的变量，比如 `.a .b` 会转成 `a_b`。

#### 媒体查询

等同于 [CSS 媒体查询](https://developer.mozilla.org/en-US/docs/Web/CSS/@media)，但类型我们只支持了 `screen`.

```css
@media screen and (min-width: 480px) {
  .title {
    font-size: 25rem;
  }
}
```

> 仅支持 Rax 0.2.x 以上

#### 伪类

伪类的使用等同于 [css-pseudo](https://developer.mozilla.org/en-US/docs/Web/CSS/Pseudo-classes)，但支持的伪类类型有限，目前只支持以下几种：

* `:active`
* `:focus`
* `:disabled`
* `:enabled`

#### 校验

如果用户输入的样式有问题，我们会在命令行或者浏览器控制台警告，当然为了性能考虑浏览器控制台的警告仅限于 development 模式下。

如果想要了解更多的实现细节，可以参考 [stylesheet-loader](https://github.com/alibaba/rax/blob/master/packages/stylesheet-loader/README.md)。

## 在 JSX 中使用 className

因为 Weex 环境不同于浏览器环境，所以标准的 className 其实是不被支持的。但我们在 Rax 中支持了这种写法。

CSS 的写法和上篇一中介绍的一样并没有变化，主要变化出现在 JS 中:

```jsx
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

如果想要了解更多的实现细节，可以参考 [babel-plugin-transform-jsx-stylesheet](https://github.com/alibaba/rax/blob/master/packages/babel-plugin-transform-jsx-stylesheet/README.md)。

