# Picture 图片

复杂的图片组件

## 使用

```
/** @jsx createElement */
import {createElement, Component, render} from 'rax';
import {ScrollView} from 'rax-components';
import Picture from 'rax-picture';

class Page extends Component {
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
render(<Page />);
```

## Props

### source

* 类型：object
* 默认值：{uri: ''}
* 必填：true

图片来源

### style

* 类型：object
* 默认值：无
* 必填：true

样式，必须设置 style.width ，在已知图像真实宽高时可不设置 style.height ，让 rax-pictrue 根据的你的图像真实宽高进行计算

```jsx
<Picture
  source={{uri: '//aecpm.alicdn.com/simba/img/TB1CWf9KpXXXXbuXpXXSutbFXXX.jpg'}}
  style={{
    width: '640rem'
  }}
  width: 320, //图片真实宽度
  height: 150 //图片真实高度
/>
```

### resizeMode

* 类型：string
* 默认值：stretch
* 必填：false

决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小。可用值：

* cover: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都大于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去）。译注：这样图片完全覆盖甚至超出容器，容器中不留任何空白。
* contain: 在保持图片宽高比的前提下缩放图片，直到宽度和高度都小于等于容器视图的尺寸（如果容器有padding内衬的话，则相应减去）。译注：这样图片完全被包裹在容器中，容器中可能留有空白
* stretch: 拉伸图片且不维持宽高比，直到宽高都刚好填满容器。

设置 resizeMode 的前提是你设置了 style.width && style.height

### forceUpdate

* 类型：bool
* 默认值：false
* 必填：false

Picture 是一个 PureComponent ，它的 shouldComponentUpdate 决定了当且仅当 porps.source.uri 有变化时才会重新 render。
如果你想忽略它的 shouldComponentUpdate，则传入 `forceUpdate={true}`

```jsx
<Picture
  source={{uri: '//aecpm.alicdn.com/simba/img/TB1CWf9KpXXXXbuXpXXSutbFXXX.jpg'}}
  style={{
    width: '750rem',
    height: '240rem'
  }}
  forceUpdate={true}
>
  <Text>{this.state.text}</Text>
</Picture>
```

### width

* 类型：number
* 默认值：无
* 必填：false

图片真实宽度，宽度单品：px

### height

* 类型：number
* 默认值：无
* 必填：false

图片真实高度，高度单品：px

### lazyload（web端有效）

* 类型：bool
* 默认值：false
* 必填：false

根据图像是否在可视范围内延迟加载图像

开启 lazyload 功能，Wed 端需在 HTML 内引入脚本：

```html
<script src="//g.alicdn.com/kg/appear/0.2.2/appear.min.js"></script>
```

### autoPixelRatio（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

在高分辨率下使用二倍图

### placeholder（web端有效）

* 类型：string
* 默认值：无
* 必填：false

lazyload 时显示的背景图 URL 

### autoRemoveScheme（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

图像 URL 自动删除协议头

### autoReplaceDomain（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

图像 URL 域名替换成 gw.alicdn.com

### autoScaling（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

为图像 URL 添加缩放后缀，将会根据 style 内的 width 属性添加缩放后缀

### autoWebp（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

添加 webp 后缀

### autoCompress（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

添加质量压缩后缀

### compressSuffix（web端有效）

* 类型：array
* 默认值：['Q75', 'Q50']
* 必填：false

图像质量压缩后缀规则

### highQuality（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

使用高质量的压缩后缀

### ignoreGif（web端有效）

* 类型：bool
* 默认值：true
* 必填：false

所有针对 URL 的优化是否忽略 gif 格式的图像，默认忽略
