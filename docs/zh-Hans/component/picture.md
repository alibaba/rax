# Picture 图片

复杂的图片组件

## 安装

```bash
$ npm install rax-picture --save
```

## 引用

```jsx
import Picture from 'rax-picture';
```

## 属性

| 名称               | 类型      | 默认值       | 描述                                       |
| :--------------- | :------ | :-------- | :--------------------------------------- |
| source           | object  | {uri: ''} | 图片来源（必需）                                 |
| style            | object  |           | 样式，必须设置 style.width ，在已知图像真实宽高时可不设置 style.height ，让 rax-pictrue 根据的你的图像真实宽高进行计算（必需） |
| resizeMode       | string  | stretch   | 决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小。下见说明。       |
| forceUpdate      | boolean | false     | Picture 是一个 PureComponent ，它的 shouldComponentUpdate 决定了当且仅当 porps.source.uri 有变化时才会重新 render。如果你想忽略它的 shouldComponentUpdate，则传入 `forceUpdate={true}` |
| width            | number  |           | 图片真实宽度，单位 px                             |
| height           | number  |           | 图片真实高度，单位 px                             |
| lazyload         | boolean | false     | （web端有效）根据图像是否在可视范围内延迟加载图像，Web 端需引入 `framework.web.js` 脚本 |
| autoPixelRatio   | boolean | true      | （web端有效）在高分辨率下使用二倍图                      |
| placeholder      | string  |           | （web端有效）lazyload 时显示的背景图 URL             |
| autoRemoveScheme | boolean | true      | （web端有效）图像 URL 自动删除协议头                   |


** resizeMode 可用值：**

* cover: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都大于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去）。译注：这样图片完全覆盖甚至超出容器，容器中不留任何空白。
* contain: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都小于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去）。译注：这样图片完全被包裹在容器中，容器中可能留有空白
* stretch: 拉伸图片且不维持宽高比，直到宽高都刚好填满容器。

设置 resizeMode 的前提是你设置了 `style.width` && `style.height`

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import ScrollView from 'rax-scrollview';
import 'rax-components'; // hack for rax-picture@0.2.5
import Picture from 'rax-picture';

class Demo extends Component {
  render() {
    return <ScrollView ref='scroll'>
       <Picture
         source={{
           uri: '//gw.alicdn.com/tfscom/tuitui/TB2jLF1lXXXXXc7XXXXXXXXXXXX_!!0-dgshop.jpg',
         }}
         style={{
           width: 375,
           height: 252
         }}
         lazyload={true}
         resizeMode="cover"
       />
    </ScrollView>;
  }
}
render(<Demo />);
```

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
