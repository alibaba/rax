---
title: Rax 系列教程（上手）
date: 20180425
author: 亚城
---

# Rax 系列教程（上手）

![Rax 系列教程（上手）](https://gw.alicdn.com/tfs/TB1IYdCnBHH8KJjy0FbXXcqlpXa-900-500.jpg)

## [](#引子 "引子")引子

这篇文章针对初学 Rax 的同学，主要介绍 Rax 是什么，开发体验的梳理，以及遇到 Rax 的开发问题如何寻求解决。本文配合 Rax 的 0.5 发布版本推出，结合新版 Rax 对于旧版的教程内容做出部分修正。

## [](#1、什么是-Rax "1、什么是 Rax")1、什么是 Rax

![](https://gw.alicdn.com/tfs/TB1CU6ofb_I8KJjy1XaXXbsxpXa-867-203.jpg)

Rax 是一个源自淘宝的开源项目 [https://github.com/alibaba/rax](https://github.com/alibaba/rax) 作为 Weex 的上层 DSL 在集团内有广泛的应用。

![](https://gw.alicdn.com/tfs/TB1vnaVfcrI8KJjy0FhXXbfnpXa-869-275.jpg)

除了跨容器、高性能、轻量等特点，Rax 是一个基于 React 写法的跨容器的 js 框架，你会用 React，那么你会很快上手 Rax。
当然与 React 也有部分区别，如下：

*   没有 createClass() 方法
*   Rax setState() 是同步的, React setState 是异步的
*   findDOMNode() 方法可以接收字符串类型的 id
*   PropTypes 只是 React 的接口兼容

下面是一个最简单的示例，在学习本文的过程中可以通过 [JSPlayground](https://jsplayground.taobao.org/raxplayground/) 进行练习，体验 Rax 的功能。

![](https://gw.alicdn.com/tfs/TB1xFm0fm_I8KJjy0FoXXaFnVXa-692-345.jpg)

## [](#2、基础知识储备 "2、基础知识储备")2、基础知识储备

If you use React, you already know how to use Rax.

### [](#JSX "JSX")JSX

熟悉 React 的同学一定对 JSX 不陌生，Rax 的 DSL 语法是基于 React JSX 语法而创造。与 React 不同，在 Rax 中 JSX 是必选的，它不支持通过其它方式创建组件，所以学习 JSX 是使用 Rax 的必要基础。

JSX 是一个看起来很像 XML 的 JavaScript 语法扩展。 它只是一种语法糖。
它是类似 HTML 标签的表达式：

```
<View style={styles.text}>
    <Text style={styles.title}>
      hello
    </Text>
</View>
```

JSX 只是 JavaScript 语法的一个语法映射。 JSX 表达式执行函数调用，我们可以看成他就是调用 createElement() 方法的快捷方式。 Babel 内置的支持 JSX 语法的编译。

扩展阅读：

*   [React Displaying Data](https://reactjs.org/docs/rendering-elements.html)
*   [React JSX In Depth](https://reactjs.org/docs/jsx-in-depth.html)

### [](#生命周期 "生命周期")生命周期

Rax 的生命周期与 React 中的概念是相同的

*   渲染阶段: componentWillMount、render、componentDidMount
*   存在阶段: componentWillReceiveProps、shouldComponentUpdate、componentWillUpdate、componentDidUpdate

![](https://gw.alicdn.com/tfs/TB1f2REhZLJ8KJjy0FnXXcFDpXa-635-432.jpg_400x400.jpg)

推荐使用 ES6 类方式创建组件, 每个组件都需要有一个 render 方法，用来接收数据然后返回要显示在页面上的内容。

```
class Hello extends Component {
  render() {
    return <Text>Hello {this.props.name}</Text>;
  }
}
```

扩展阅读

*   [开发组件文档中对于生命周期的描述](https://alibaba.github.io/rax/guide/component)

### [](#通用事件 "通用事件")通用事件

**点击事件**

对于简单的 Touch 事件，我们使用 Touchable 组件, 通过给它绑定 onPress 事件，来监听他的点击事件。移动设备中为了区分点击与长按操作，通常点击事件会有 300 毫秒的延迟。

```
<Touchable onPress={() => console.log('pressed')}>
  <Text>Touch</Text>
</Touchable>
```

**长按事件**

weex 的 `<input>` 和 `<switch>` 组件目前不支持 click 事件，使用的时候需要注意。

**Appear**

Appear 可以让我们在元素出现的时候做一些事情，比如曝光埋点。在 Web 上 Rax 的 framework 同样提供了 Appear 事件用来抹平与 Weex 的差异。

```
<View onAppear={(ev) => {
  console.log('appear');
}} onDisappear={(ev) => {
  console.log('disappear');
}}>
  <Text>Hello</Text>
</View>
```
使用时需要注意，Appear 事件需要绑定在滚动容器内的元素上。

**滚动事件**

目前提供的滚动容器 ScrollView、RecyclerView、ListView、WaterFall 均支持一下滚动事件与属性

*   onScroll：滚动实时触发事件
*   onEndReachedThreshold：滚动区域还剩 loadmoreoffset 的长度时触发
*   onEndReached：滚动到容器底部触发事件

**输入事件**

TextInput 是唤起用户输入的基础组件。当定义 multiline 输入多行文字时其功能相当于 textarea。

```
<TextInput
  placeholder="Enter text to see events"
  autoFocus multiline
  onFocus={() => console.log('onFocus')}
  onBlur={() => console.log('onBlur')}
  onInput={() => console.log('onInput')}
/>
```

**复杂手势**

与 React Native 中的 PanResponder 相同的手势支持外，Rax 还提供了 Weex 上性能表现更好的 binding 手势支持（未来开源）。

**Page 事件**

Weex 通过 viewappear 和 viewdisappear 事件提供了简单的页面状态管理能力，需要注意的是目前该事件 Web 不支持。

viewappear 事件会在页面就要显示或配置的任何页面动画被执行前触发，例如，当调用 navigator 模块的 push 方法时，该事件将会在打开新页面时被触发。viewdisappear 事件会在页面就要关闭时被触发。

与组件的 appear 和 disappear 事件不同的是，viewappear 和 viewdisappear 事件关注的是整个页面的状态，所以它们必须绑定到页面的根元素上

```
let weexDocument = typeof __weex_document__ === 'object' ?
      __weex_document__ : typeof document === 'object' ?
        document : {};
if (isWeex && weexDocument && weexDocument.body) {
  setNativeProps(findDOMNode(weexDocument.body), {
    style: {backgroundColor: 'yellow'},
    onViewAppear: () => {
      console.log('onviewappear');
    },
    onViewDisAppear: () => {
      console.log('onviewdisappear');
    }
  });
}
```

扩展阅读

*   [Rax 中的事件](https://alibaba.github.io/rax/guide/event-handle)
*   [Weex 中的事件](//weex.apache.org/cn/references/common-event.html)

### [](#样式 "样式")样式

在书写 Rax 页面样式之前需要知道几件事情

*   Rax 无单位与 rem 单位等价
*   页面宽度默认是 750rem，各端兼容
*   为了与 Weex 有一致的效果，我们推荐 Flexbox

Rax 样式支持行内样式与 className

**行内**

```
import styles from './foo.css';

function Foo() {
  return <div style={styles.container}>
    <span style={styles.container_title}>hello world</span>
  </div>;
}
```

**className**

```
import './foo.css';

function Foo() {
  return <div className="container">
    <span className="container_title">hello world</span>
  </div>;
}
```

扩展阅读

*   [Flexbox 和样式](https://alibaba.github.io/rax/guide/style)
*   [Weex 通用样式](https://weex.apache.org/cn/references/common-style.html)
*   [Weex 文本样式](https://weex.apache.org/cn/references/text-style.html)

## [](#3、Rax-的-Driver "3、Rax 的 Driver")3、Rax 的 Driver

不同场景的 Driver 让 Rax 在不同的运行环境下都有一个良好的表现，在 Weex 和 Browser 上的表现是我们平时业务上最关心的，除此之外 Rax 有更多的尝试

### [](#Driver-weex "Driver-weex")Driver-weex

*   Device 相关，抹平与 web 的差异
*   setRem（基准值的设定（getDeviceWidth/getViewportWidth））
*   部分样式处理（transformPropsAttrsToStyle）
*   w3cElements 能力的提供
    *   span p img button video textarea nav footer aside main h1 h2 h3 …

### [](#Driver-browser "Driver-browser")Driver-browser

*   Device 相关，抹平与 Weex 的差异
*   flex 布局相关
    *   抹平不同浏览器之间的差异（webkit 前缀的支持）

### [](#Driver-server "Driver-server")Driver-server

*   服务端渲染的基础方法支持

### [](#Driver-webgl "Driver-webgl")Driver-webgl

*   一套标签化的 3d 场景描述
    *   carmeras control core geometries lights materials objects(line mesh points scene) scenes…
*   three 的上层包装

![](https://gw.alicdn.com/tfs/TB1ZwVgh26H8KJjy0FjXXaXepXa-382-672.gif)

## [](#4、Rax-的-framework "4、Rax 的 framework")4、Rax 的 framework

Write Once, Run everywhere!

Native 和 Web 天生就有很多差异，为了让开发者有更好的体验，大部分的差异是不需要让开发者去关心的。因此 Native 端我们模拟出了大量 Web 端的标准全局 API，Web 端同样为了模拟 Native 的特性做了很多支持。

### [](#weex-rax-framework "weex-rax-framework")weex-rax-framework

*   全局的 window 变量（全局方法的注册）
*   跨页面实例的 emitter 通信与页面内通信 (addEventListener)
*   location, Response, Request, XMLHttpRequest, URL, URLSearchParams, FontFace, WebSocket, Event, CustomEvent, matchMedia, setTimeout, setInterval, requestAnimationFrame…
*   **weex_define**, **weex_require**, **weex_downgrade**, **weex_env**, **weex_code**, **weex_options**, **weex_data**, **weex_config** …

### [](#web-rax-frmework "web-rax-frmework")web-rax-frmework

*   Object.assign Object.entries Object.values…
*   Array.from
*   Number.isNaN
*   appear 模拟，抹平 weex 之间的差异
*   defaule builtin modules

## [](#5、上层体系 "5、上层体系")5、上层体系

### [](#环境-API "环境 API")环境 API

Rax Framework 参照 W3C 规范，提供了以下在 Weex 和 Web 环境一致的全局 API，例如你可以在 Weex 的页面这样使用全局的 postMessage

```
addEventListener('message', (e) => {
  console.log('this data is', e.data);
});
setTimeout(() => {
  window.postMessage('{hello:1}', '*');
}, 1000);
```

（全局 API 的可用环境为 Weex 版本 >=0.9.5 可用，对应手淘版本 >= 6.4.0 可用，低于该版的设备建议可以考虑降级 h5）

### [](#通用组件 "通用组件")通用组件

![](https://gw.alicdn.com/tfs/TB1XrNQh2DH8KJjy1XcXXcpdXXa-419-379.jpg)

Rax 的通用组件主要的工作就是对表 Weex 的基础标签，在保证功能完备的基础上抹平 Web 的实现。
基础组件的 API 设计是遵照 RN 的思路。举个例子，Weex 为我们提供了通用的 click 事件，但是对标 RN 的规范，我们还是推荐开发者使用 Touchable 标签的 press 实现点击。Rax 作为开源项目与社区接轨也是为了能够更好的与社区融合，我们也可以更方便的吸纳社区的力量。

![](https://gw.alicdn.com/tfs/TB1C_pzh4rI8KJjy0FpXXb5hVXa-838-385.jpg)

基础的组件可以组成复杂的组件或者模块，上面的 tabheader 就是个例子。

![](https://gw.alicdn.com/tfs/TB1Lzglh_nI8KJjy0FfXXcdoVXa-868-330.jpg)

无论什么类型的页面我们都可以通过组件进行拼装，随着业务需求的发展，我们还会遇到很多新点子，很多新的挑战。我们鼓励开发者可以提炼出更多通用的功能或者组件贡献给 Rax。

![](https://gw.alicdn.com/tfs/TB19PE1OVXXXXcsaXXXXXXXXXXX-1020-699.jpg)

想了解更多 Rax 组件能力，可以参考 Rax 的[官网](https://alibaba.github.io/rax/)和[github](https://github.com/alibaba/rax/tree/master/packages)

## [](#6、开发环境 "6、开发环境")6、开发环境

### [](#rax-cli "rax-cli")rax-cli

*   cli 命令面向开源用户，不依赖阿里内部的工具以及环境
*   项目同时构建出 web 与 weex bundle

环境安装

```
npm install rax-cli -g
```

项目初始化

```
rax init YourProjectName
```

页面预览

```
cd YourProjectName
npm run start
```

![](https://gw.alicdn.com/tfs/TB1FYG8h8TH8KJjy0FiXXcRsXXa-826-382.jpg)

查看运行的 Rax 的 bundle 源码会发现首行有一题条这样的注释

```
// {"framework" : "Rax"}
```

bundle 如果缺少该 framework 声明将会有 framework 提供的 API 缺失问题。

_小技巧：上面的 weex bundle 也可以这样访问 [//h5Page地址.html?_wx_tpl://weexBundle地址.js](//h5Page地址.html?_wx_tpl://weexBundle地址.js)_

![](https://gw.alicdn.com/tfs/TB1orW8h8TH8KJjy0FiXXcRsXXa-873-360.jpg)

cli 工具创建的目录结构较为简单，适合开发者进行上层定制

## [](#7、调试环境 "7、调试环境")7、调试环境

###调试环境###

使用 cli 工具本地起一个调试环境，生成如下形式的页面地址：
[//your_page_.html?_wx_tpl=//your_page_bundle.js](//your_page_.html?_wx_tpl=//your_page_bundle.js)

在浏览器环境直接访问该地址，可以得到 Web 页面；通过 Weex Playground 访问，则会返回相应的 Weex 页面。

###调试工具###

1、 weex-toolkit（本地调试）

我们使用 [weex-toolkit](https://weex.apache.org/cn/guide/tools/toolkit.html) 来进行调试

```
tnpm install -g weex-toolkit
weex debug -l
```


## [](#8、发布 "8、发布")8、发布

### [](#发布注意事项 "发布注意事项")发布注意事项

*   业务发布前，必须在以下环境完成测试
    *   Weex(Android/iOS) 未降级的客户端版本
    *   Web(Android/iOS) 未降级和已降级的客户端版本
    *   有外投多个客户端的业务需要在每个客户端做以上回归
*   手淘版本无法做到全量覆盖，如业务依赖某个手淘版本，必须
    *   在该手淘环境和线上环境都完成测试
    *   明确发布先后顺序
    *   明确在老版本手淘下访问的兼容方案
*   离线包无法做到全量更新，如业务使用离线包，必须
    *   明确改动不会对未覆盖到版本造成影响（如果接口的不兼容变更）
    *   紧急问题的修复采用【强制更新+推新包+全网络】的策略
*   使用内置组件的业务应提前做好充足的降级的预案
    *   内置组件 bundle 降级完整 bundle 规则
    *   Weex bundle 降级 h5 规则
*   业务发布后，必须再次验证以上环境

## [](#9、完整的例子 "9、完整的例子")9、完整的例子

我知道怎么写一个 hello world，但对于如何写一个项目可能还有些无从下手，我们能找到一些成品的例子作为参考。Rax 官网提供了大量的 demo 和 模版，帮助新上手的同学进行学习。

![](https://gw.alicdn.com/tfs/TB1.AIfh3DD8KJjy0FdXXcjvXXa-834-378.jpg)

以下页面例子可以参考

*   [淘宝下单页](https://github.com/alibaba/rax/tree/master/templates/template-buy)
*   [即时通信类页面](https://github.com/alibaba/rax/tree/master/templates/template-chat)
*   [零售通的应用主页](https://github.com/alibaba/rax/tree/master/templates/template-retail)
*   [淘宝首页](https://github.com/alibaba/rax/tree/master/templates/template-taobao)
*   [问答类列表页](https://github.com/alibaba/rax/tree/master/templates/template-zhihu)

（以上内容是关于 Rax 上手的一些内容，Rax 的其他教程敬请期待～）

> 题图：[https://unsplash.com/photos/8u5JvXfp4uw](https://unsplash.com/photos/8u5JvXfp4uw) By @rawpixel.com