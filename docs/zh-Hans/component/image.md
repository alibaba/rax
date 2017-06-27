# Image 图片

基础类型的图片实现，这里的 Image 组件只提供了基础的图片展示，更好的显示图片可以使用 Picture 组件。 

![](https://gw.alicdn.com/tfs/TB1KqzRRVXXXXasaXXXXXXXXXXX-255-367.gif)

## 安装

```bash
$ npm install rax-image --save
```

## 引用

```jsx
import Image from 'rax-image';
```

## 属性

| 名称         | 类型     | 默认值  | 描述                           |
| :--------- | :----- | :--- | :--------------------------- |
| scoure     | Object | ''   | 设置图片的 uri                    |
| style      | Object | ''   | 样式 图片不设置宽高则默认为0x0            |
| resizeMode | String | ''   | 决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小 |

同时支持任意自定义属性的透传。  

其中 resizeMode 支持的值包括：contain、cover、stretch、center、repeat。

## 本地图片示例
在使用前请先检查 webpack.config.js 中已经启用了 image-source-loader

```jsx 
import {createElement, Component, render} from 'rax';
import Image from 'rax-image';

class App extends Component {
  render() {
    return (
      <Image source={require('./path/to/your/image.png')}
        resizeMode="cover"
      />
    );
  }
}

render(<App />);
```

## URL 图片示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Image from 'rax-image';

class App extends Component {
  render() {
    return (
      <Image source={{
          uri: 'https://gw.alicdn.com/tfs/TB1g6AvPVXXXXa7XpXXXXXXXXXX-215-215.png'
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
