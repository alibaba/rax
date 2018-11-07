---
title: Rax 系列教程（native 扫盲）
date: 20180129
author: 亚城
---

# Rax 系列教程（native 扫盲）

![Rax 系列教程（native 扫盲）](https://gw.alicdn.com/tfs/TB1nuoFXTtYBeNjy1XdXXXXyVXa-900-500.jpg)

## [](#引子 "引子")引子

Rax 天生就是一个跨容器的解决方案，这让我们不必单独了解 iOS 和 安卓背后做了什么，让我们的开发变得很省心。但真实情况是我们的业务往往同时跑在 web 和 native 两端，web 我们轻车熟路是前端天生的优势，native 对很多人来说就会有些陌生，native 上出现的各种问题用 web 的路子去解释往往会解释不通。据 2017 年底粗略统计 Rax 的用户 70% 是前端同学，本文面向前端，简单介绍一下 Rax 背后的 native 端在做的一些事情。本文吸取了大量前人的经验，对于过深的 native 概念进行了剔除，以求前端同学更好理解，如果想更深入了解的同学可以参考下面附件内容。

## [](#Rax-＝-RN-语法-Weex-能力 "Rax ＝ RN 语法 + Weex 能力")Rax ＝ RN 语法 + Weex 能力

Rax 是一套基于 React 写法的 Weex 上层 DSL，很自然的我们就会拿来和 RN 进行对比。实际上 Rax 的设计上也是在尽量靠拢 RN。下面我们先来了解一下。

### [](#Rax-与-React-Native "Rax 与 React Native")Rax 与 React Native

```
RN: Learn once, write anywhere
```

Rax 的使用方式和 RN 类似，RN 基于开源 JavaScript 库 React.js 来开发 iOS 和 Android 原生 App，在 JavaScript 中用 React 抽象操作系统原生的 UI 组件，代替 DOM 元素来渲染，比如以 View 取代 div，以 Image 替代 img 等（Rax 此处步调一致）。

![image | center](//img2.tbcdn.cn/L1/461/1/14e53ead86ead4d3355813e935072df0742a2c95)

一次学习，便可以编写 iOS 和 Android 两端的代码，这是 RN 的理念。与 RN 不同，Rax 在靠拢 RN 规范的同时，还做了另外一件事情就是跨端，让一次学习变成了一次编写。

作为背景了解可以了解 [ReactNative](https://facebook.github.io/react-native/) 官网，RN 的学习资料比较容易获取这里不再展开。

### [](#Rax-与-Weex "Rax 与 Weex")Rax 与 Weex

```
Weex: write once run anywhere
```

Rax 在 Native 端的背后实现则是 Weex，Weex 是一款轻量级的移动端跨平台动态性技术解决方案

![image | center](//img1.tbcdn.cn/L1/461/1/dff0329b60fe0637fa286a58a2de4f41497407cf)

（图引自 ppt《weex-前端》by 子宽/饮源）

流程如下

*   开发者使用 Weex DSL 编程（Vue/Rax）
    *   历史上还有过 .we 框架，已经不推荐使用
*   用 transformer 将代码转换为纯 JS 代码
*   客户端 JS 解析与 UI 绘制

Server 端主要职责是 weex DSL 到 JS 的转换，以及 JS 的部署下发
Client 端则负责客户端的绘制部分，具体如下：

*   JS framework 其实就是一个 JS 文件, Weex SDK 中的 main.js。framework 主要负责 JS 与 natvie 之间的交互。数据绑定、事件逻辑处理等。
*   Render Engine 由 Native 代码实现，主要负责界面渲染和少量的事件触发逻辑。所有的布局元素，都会在这一层转化为原生组件。Weex 当前支持内建组件包括 list、scroller、text、image、input 等
*   目前 V8 已经全部被 JSC 取代

### [](#framework "framework")framework

(iOS 角度解析，弱化了部分纯客户端的概念)

SDK 初始化时比业务先注入 JS framework，如下

**Weex runtime 初始化**

*   Native初始化（JS framework）initSDKEnvironment
*   JSContext 扩展属性，比如 `name`，`WXEnvironment` 等全局的 API
*   WXBridgeContext registerGlobalFunctions 注册 `Native module`，`component`等，给 JSContext 扩展 callback，全部转换成数字 id，每一个 module，component 等都有其对应的 id。
*   JSContext evaluateScript 执行 JS `framework.js` 代码

**业务 bundle 初始化脉络研究**

*   WXSDKInstance renderWithURL 注入业务 bundle url
*   WXBridgeContext callJSMethod 传入 @”createInstance”，以及组织参数args @[instance, temp, options ?: @{}, data]，data就是业务bundle JavaScript字符串
*   判断 frameworkLoadFinished 是否准备就绪，准备就绪调用@”createInstance”
*   JSContext globalObject invokeMethod 方法，获取之前初始化时JSContext的“全局对象”引用，类似浏览器的 “window” 对象，也就是执行weex-framework.js中的 `createInstance` 方法，接收的参数是@[instance, temp, options ?: @{}];
*   从 weex-framework.js 中的 createInstance 调用到了 Rax framework 的 `window api` 注入
*   Rax framework 初始化页面代码，返回全局的 window 环境，（未来使用 createInstanceContext 替换的场景将在后续 framework 的教程中解释）

创建 UI 界面的计算是在 JavaScript 这边的，创建和销毁阶段都是由 Native 主动调起 JavaScript 的方法。这里先介绍一下 JSCore，JavaScriptCore 是封装了 JavaScript 和 Objective-C 桥接的 Objective-C API，可以做到 JavaScript 调用 Objective-C，或者 Objective-C 调用 JavaScript。

createInstance 最后 sendTasks 实际上是调用 Weex 仓库 runtime/config.js 的 sendTasks ，而这个方法传递给 callNative。callNative，是Native注册的block，这是JS framework 与 Native 连接脉络的最后一步。

### [](#Weex-virtual-DOM "Weex virtual-DOM")Weex virtual-DOM

Weex 在 JS 端有一层 virtual-DOM 的设计，这一层设计一方面使得 Weex 能够通过 JS 控制 native 的视图层，另外也提供了一个相对中立的规范，供上层 JS 框架调用。

![](//img2.tbcdn.cn/L1/461/1/d3562f1fc42fc59767ff05edff11f6e691ad5c86)
(图片引自《Weex 中的 virtual-DOM 介绍》 by 勾股)

我们在 Weex 中所能感受到的各种视觉效果和交互效果，实际上都是通过这样的 virtual-DOM 结构进行分解和执行的。virtual-DOM 的设计很大程度上借鉴了 HTML DOM 的设计，不论从 API 还是 class，但做了一定的简化和取舍，主要包括以下几点：

*   传统的 HTML DOM 分了很多种 nodeType，比如 Element、TextNode、Comment、CDATA、Entity、Attribute、Fragment … 等， Weex 只保留了 Element 和 Comment ，一个 Element 对应着 native 的一个 View，而 Comment 通常对 native 来说是无意义的，但是它可以帮助 JS 上层的框架用作一些特殊处理时的 placeholder。
*   传统的 HTML DOM 是既有 attribute 又有 property 的，property 里还包括 style、方法调用这样的特殊 property， Weex 只保留了 attributes，没有 properties ，但支持一个特殊的维度，就是样式 style。
*   传统的 HTML DOM 是支持同一个 Element 绑定多个事件的，从 JS 和 native 通信的角度，这样做是没有必要的， 所以 Weex 只提供了 DOM Level 0 的事件模型，也就是 onxxx=”fn”。 如果同一个 Element 需要在业务层绑定多个事件，可以在 virtual-DOM 上层再进行封装
*   传统的 HTML DOM 事件是存在捕获和冒泡阶段的， Weex 做了精简，没有支持冒泡或捕获事件 ，只有在 native 层的当前元素触发该事件才会 fireEvent 给 JS。
    传统的 HTML DOM 针对每个页面有唯一且现成的 document、document.documentElement、document.body，但是在 Weex 中，由于每个页面需要的初始化 body 类型是有选择的，基本上分 scroller、div、list 这三种，根据页面不同的展示特征而定， 所以 Weex 页面的 document.body 是需要手动创建的，并且有机会制定其类型为 scroller、div、list 其中的一种。
*   Weex 不支持 XML 的 namespace 语法

## [](#Weex-与-Web-的天生不同 "Weex 与 Web 的天生不同")Weex 与 Web 的天生不同

### [](#页面布局 "页面布局")页面布局

**布局**

Flexbox 是 Weex 中默认且唯一的布局模型，不需要手动为元素添加 display: flex; 属性。传统 web 布局花样繁多，不过 Weex 上我们布局的方式有些局限，比如我们无法使用 float 布局，对于 absolute 布局最好我们也需要谨慎使用（长列表性能考虑）。（布局样式参考[这里](https://weex.apache.org/cn/references/common-style.html)

**样式**

Weex 中样式使用限制包括

*   写在组件 style 里的样式只能用在当前组（作用域默认是 scoped）
*   样式不能继承
*   文本样式只能作用于 Text 标签，如 fontSize
*   支持的样式属性有限，如不支持 z-index

Weex 对于 CSS 的支持相比 Web 弱了很多，很多酷炫的 CSS 必杀技在 Weex 上是不太好施展拳脚的，所以在我们写样式之前最好能先读一读 Weex 的 [通用样式](//weex.apache.org/cn/references/common-style.html) 和 [文本样式](//weex.apache.org/cn/references/text-style.html)

**单位**

Weex 中做元素的布局时需要先了解一下 Rax 在 Weex 上的单位，Weex 天生支持 wx 和 px

*   rem: Rax 中推荐单位，无单位默认也是 rem，rem 单位是将页面 750 等分计算的，同 Weex 中的 px 单位
*   wx：该单位是 Weex 特有的单位，它与像素无关
*   px & 没有单位：对于没有单位或单位为 px 的尺寸，Weex 会乘上当前屏幕的宽和 750 的比值，以这种方式来进行适配不同分辨率的屏幕

**霸道的 list cell**

除了 Web 和 Weex 的差异，在 iOS 和 Android 上同样存在细微的差异。Android list 中的 cell，无法展示内部超出的元素。如下图，我们如果要实现 图 1 的效果，如果直接用绝对定位飘出去，可能在安卓下会被 cell 截断得到图 2 的效果

![](https://gw.alicdn.com/tfs/TB1cOnwk2DH8KJjy1XcXXcpdXXa-414-219.jpg)

### [](#list "list")list

Web 页面天生是可以滚动的，Native 中却不是。于是 Native 中提供了滚动容器来解决。Rax 中的滚动容器有如下几个（对于列表的详细分析这里也不展开，只说 list native 原理部分）

*   ScrollView 的 Weex 实现是 slider，支持垂直和水平的滚动
*   RecyclerView 的 Weex 实现是 list，可回收的长列表（此标签下面会举例展开细说）
*   ListView 是 RecyclerView 的上层包装，对标 RN 的能力
*   WaterFall 底层实现上也是 list 的一个扩展，在 api 能力上向 ListView 靠拢
*   TemplateList 的 Weex 实现是 recycler-list，是一个基于数据与模版的高性能长列表

**可回收的长列表 RecyclerView**

Rax 的 RecyclerView 是一个高性能的可回收长列表，它的内部实现是 Weex 的 list 标签。Weex Android 的 List 的原生实现是 Android RecyclerView 组件，在 iOS 上则使用的是原生的 UITableView。它又一个重要特性就是可以回收非可视区域的 cell，并进行复用。

Android RecyclerView

在 Android 中，RecyclerView 提供了复用机制来减少内存开销、提升滑动效率，Weex 中 List 也暴露出相应的 API 支持 Cell 复用：设置相同 scopeValue 的 Cell 支持 ViewHolder 复用，这里的 ViewHolder 服用是只重复的数据类型复用，cell 内如果拥有相同的 children 结构，则该类型的 cell 可以复用，滑出可视区域的 cell 会被回收，在内部实现中不通 RecyclerView 的相同结构 cell 也有复用的策略。

iOS UITableView

UITableView 是一个以行数据概念实现的列表，每一行数据都是一个 UITableViewCell。
为了性能上更优，利用有限的结构动态切换其内容来尽可能减少资源占用，以达到 cell 复用。
UITableView内部有一个缓存池，初始化时使用 initWithStyle:(UITableViewCellStyle) reuseIdentifier:(NSString *) 方法指定一个可重用标识，就可以将这个 cell 放到缓存池。然后在使用时使用指定的标识去缓存池中取得对应的 cell 然后修改 cell 内容即可。以达到滚动时创建的 cell 地址是初始化时已经创建的。（详细不展开，原理在[这里](//www.cnblogs.com/kenshincui/p/3931948.html)）

### [](#图片 "图片")图片

Web 中我们不指定图片的宽高页面会自动撑开，Weex 中却不会，内部实现的不同导致我们渲染图片的时候必须传入宽高（图片默认高度为 0）。虽然我们在图片的 onLoad 事件中可以拿到宽高信息，但此时再设置宽高会产生页面的抖动。在做瀑布流布局时图片的宽高就更加必要了。

另外 Weex 中相比 Web 图片额外做了加载的优化，我们不用考虑 Weex 上的图片懒加载。

不能设置背景图，只能使用图片插入到文档中

针对 gif 图片的显示依赖客户端的图片库，手淘环境可以在 attribute 和 style 上设置 quality=’original’ 解决，这个属性主要是让客户端的图片库不去优化该图片（避免一些 cdn 优化策略在某些 Weex 图片上不适用）

### [](#事件 "事件")事件

Weex 支持的事件类型有限，支持的事件类型见 [通用事件](https://weex.apache.org/cn/references/common-event.html)，且不区分事件的捕获阶段和冒泡阶段，相当于 DOM 0 级事件。Appear 事件，Page 事件都是和传统 Web 开发思路有所不同的。

### [](#内建模块 "内建模块")内建模块

Weex 为我们提供了许多内建模块：
animation、WebSocket、picker、meta、clipboard、dom、modal、navigator、storage、stream、webview、globalEvent 等等。

这部分是区别于 Web 的一些功能，直接调用移动端设备能力，Rax 中使用内建模块方式如下：

```
let dom = require('@weex-module/dom');
dom.getComponentRect('viewport', (e) => {
  console.log(e.result, e.size);
});
```

## [](#小结 "小结")小结

在 Rax 项目的实际开发过程中有很多和传统 Web 开发是不同的。我们更多的了解一些背后的机制，会对我们排查问题有所帮助。文章有遗漏之处或者不准确的地方欢迎指出。

> 题图：[https://unsplash.com/photos/i-P1lmY_e1w](https://unsplash.com/photos/i-P1lmY_e1w) By @Sergey Pesterev