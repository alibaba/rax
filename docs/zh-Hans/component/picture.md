# Picture 图片

复杂的图片组件，包涵懒加载图片、resizeMode 优化等功能，使用阿里 cdn 的图片可以享受 cdn 的部分优化策略。

（针对 gif 图片的显示依赖客户端的图片库，手淘环境可以在 attribute 和 style 上设置 quality='original' 解决）

![](https://gw.alicdn.com/tfs/TB1sH3gRVXXXXcuXpXXXXXXXXXX-260-424.jpg)

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
| placeholder      | string  |           | （web端有效）lazyload 时显示的背景图 URL, 不能同时设置 resizeMode，会有意想不到的效果             |
| autoRemoveScheme | boolean | true      | （web端有效）图像 URL 自动删除协议头                   |
| autoReplaceDomain | boolean | true             | （web端有效） 图像 URL 域名替换成 gw.alicdn.com      |
| autoScaling       | boolean | true             | （web端有效） 为图像 URL 添加缩放后缀，将会根据 style 内的 width 属性添加缩放后缀 |
| autoWebp          | boolean | true             | （web端有效） 添加 webp 后缀                      |
| autoCompress      | boolean | true             | （web端有效） 添加质量压缩后缀                        |
| compressSuffix    | array   | `['q75', 'q50']` | （web端有效） 图像质量压缩后缀规则                      |
| highQuality       | boolean | true             | （web端有效） 使用高质量的压缩后缀                      |
| ignoreGif         | boolean | true             | （web端有效） 所有针对 URL 的优化是否忽略 gif 格式的图像，默认忽略 |



** resizeMode 可用值：**

* cover: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都大于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去，仅安卓有效）。译注：这样图片完全覆盖甚至超出容器，容器中不留任何空白。
* contain: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都小于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去，仅安卓有效）。译注：这样图片完全被包裹在容器中，容器中可能留有空白
* stretch: 拉伸图片且不维持宽高比，直到宽高都刚好填满容器。

设置 resizeMode 的前提是你设置了 `style.width` && `style.height`

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Picture from 'rax-picture';

let image = '//camo.githubusercontent.com/27b9253de7b03a5e69a7c07b0bc1950c4976a5c2/68747470733a2f2f67772e616c6963646e2e636f6d2f4c312f3436312f312f343031333762363461623733613132336537386438323436636438316338333739333538633939395f343030783430302e6a7067';

class App extends Component {
  render() {
    return (
      <View style={styles.root}>
        <View style={styles.container}>
          <Picture
            source={{uri: image}}
            style={{
              width: 600
            }}
            lazyload={true}
          />
          <Text>resizeMode="cover"</Text>
          <Picture
            source={{uri: image}}
            style={{
              width: 400,
              height: 200,
            }}
            resizeMode="cover"
            lazyload={true}
            autoWebp={false}
            autoCompress={false}
            autoRemoveScheme={false}
            autoReplaceDomain={false}
            autoScaling={false}
            highQuality={false}
          />
          <Text>text and image</Text>
          <Picture
            source={{uri: image}}
            style={{
              width: 300,
              height: 300
            }}
            lazyload={true}
          >
            <Text style={{color: 'blue', fontSize: 40}}>hello rax</Text>
          </Picture>
        </View>

      </View>
    );
  }
}

let styles = {
  root: {
    width: 750,
    paddingTop: 20
  },
  container: {
    padding: 20,
    borderStyle: 'solid',
    borderColor: '#dddddd',
    borderWidth: 1,
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 10,
  },
};

render(<App />);
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
