# stylesheet-loader

> A webpack loader that imports a css file and converts it to be used as an inline style

## Install

```sh
npm install --save-dev stylesheet-loader
```

## Usage

Config stylesheet loader in `webpack.config.js`:
```js
// webpack.config.js

module.export = {
  module: {
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

.container .title {
  font-size: 20px;
}
```

```js
// foo.js
import styles from './foo.css';
// import styles from 'stylesheet!less!./foo.less';
function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title></span>
  </div>;
}
export default Foo;
```
