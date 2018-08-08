# Image

[![npm](https://img.shields.io/npm/v/rax-image.svg)](https://www.npmjs.com/package/rax-image)

Based on the realization of the type of image, a better picture can be displayed using Picture components.


## Install

```bash
$ npm install rax-image --save
```

## Import

```jsx
import Image from 'rax-image';
```

## Props

| name  | type   | default | describe |
| :------------- | :----- | :------ | :--------------------------- |
| source         | Object | ''      | set image uri                    |
| fallbackSource | Object | ''      | load fallback image when source image load failed      |
| style          | Object | ''      | if picture is not set wide high default is 0x0            |
| resizeMode     | String | ''      | Decide how to resize the image when the component size and picture size are out of proportion |

Support any custom attributes.  

resizeMode supported values include：contain、cover、stretch、center、repeat

## Local image sample

Before you use it, check that image-source-loader is already enabled in webpack.config.js

```jsx 
import {createElement, Component, render} from 'rax';
import Image from 'rax-image';

class App extends Component {
  render() {
    return (
      <Image
        source={require('./path/to/your/image.png')}
        fallbackSource={{
          uri: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_70x70.jpg'
        }}
        resizeMode="cover"
      />
    );
  }
}

render(<App />);
```

## URL image sample

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Image from 'rax-image';

class App extends Component {
  render() {
    return (
      <Image
        source={{
          uri: 'https://gw.alicdn.com/tfs/TB1g6AvPVXXXXa7XpXXXXXXXXXX-215-215.png'
        }}
        fallbackSource={{
          uri: 'https://gw.alicdn.com/tps/i3/TB1yeWeIFXXXXX5XFXXuAZJYXXX-210-210.png_70x70.jpg'
        }}
        style={{
          width: 100,
          height: 100,
        }}
        resizeMode="cover"
      />
    );
  }
}

render(<App />);
```
