# stylesheet-loader

> A webpack loader that imports a css file and converts it to be used as an inline style

## Install

```sh
npm install --save-dev stylesheet-loader
```

## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

Config stylesheet loader in `webpack.config.js`:
```js
// webpack.config.js

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

```css
/* foo.css */
.container {
  background-color: blue;
}

.container_title {
  font-size: 20px;
}
```

```js
// foo.js
import styles from './foo.css';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title>hello world</span>
  </div>;
}
export default Foo;
```

### Write less

`webpack.config.js`:
```
{
  test: /\.less$/,
  loader: 'stylesheet!less'
}
```

```less
// foo.less
@contaner-bg: #5B83AD;
@title-size: 20px;

.container {
  background-color: @contaner-bg;
}

.container_title {
  font-size: @title-size;
}
```

```js
// foo.less
import styles from './foo.less';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title>hello world</span>
  </div>;
}
export default Foo;
```

### Options

#### `transformDescendantCombinator`

Default does not support nested, but you can also choose to avoid this constraint when set `transformDescendantCombinator` to true.

### Support font-face

```
@font-face {
  font-family: icon;
  src: url(http://at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf);
}
```
