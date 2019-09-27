---
title: Rax 淘宝 双11 双12 实战
date: 20170427
author: 亚城
---

# Rax 淘宝 双11 双12 实战

<img src="https://gw.alicdn.com/tfs/TB1XDuDPXXXXXbRapXXXXXXXXXX-900-500.jpg" style="text-align: center;"/>

Rax is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rax.

Rax 介绍参考：[//react-china.org/t/rax-rax/11552](//react-china.org/t/rax-rax/11552)

## 上层体系

### 能力范围

Rax 核心框架之上，有一个支撑业务的基础体系。模拟浏览器行为和业务基础功能的 API、最基础的简单标签和基础 UI 组件体系。

![](https://gw.alicdn.com/tps/TB1oWxhPXXXXXc_XpXXXXXXXXXX-763-431.jpg_500x500.jpg)

Components 对应最基础的 HTML 标签，提供了最基础的标签能力，开发同学可以通过 Components 标签搭建出最基础的组件以及模块和页面。

通过最基础的标签组成基础 UI 组件，除了 UI 组件，双促中使用的页面核心渲染逻辑也是基于 Components 标签搭建出来的。基础 UI 成为了大促模块搭建的基础、rax-page 则是页面渲染的基础。通过上层对数据请求的封装、缓存策略、页面渲染顺序的控制等组织成了斑马联路中使用的 PI，让页面可以在双促斑马搭建环境中运作。

### 基础 UI 组件

![](https://gw.alicdn.com/tps/TB19PE1OVXXXXcsaXXXXXXXXXXX-1020-699.jpg_500x500.jpg)

 Rax 上层的组件生态，包含了业务中常用的组件，比如横向滚动轮播（slider）、icon、tab 导航头（tabheader）、视频播放（player）等。

上图中列出了部分 UI 组件，通过 rax-picture、rax-slider、rax-tabheader、rax-gotop 等可以组成一个常见的带电梯长列表页面，如下图。

![](https://gw.alicdn.com/tps/TB1499MOVXXXXcIXXXXXXXXXXXX-641-436.png_500x500.jpg)

基础 UI 组件已经涵盖了大部分业务中需要的组件场景，为开发提供了一定的便利。

### 对开发者的影响

![](https://gw.alicdn.com/tps/TB1eGRnPXXXXXXcXpXXXXXXXXXX-587-465.jpg_500x500.jpg)

一个淘宝大促页面模块的开发与往年有很大不同，除了开始使用 React 的写法外，还有一套模块与页面渲染 PI 的约定。(PI: 大促页面通用渲染策略)

![](https://gw.alicdn.com/tps/TB1bbcPOVXXXXc9aXXXXXXXXXXX-722-362.jpg_500x500.jpg)

大促模块分为两类，滚动容器外部的 app 级模块和 滚动容器内的 page 级模块。在 page 级模块的开发过程中需要遵循一些与页面渲染相关的约定，来实现特定逻辑和特定渲染策略。例如 moduleRenderMode 来制定模块类型、getModuleRowHeight 来获取模块高度，以及通过 props 透传的工具方法等。

```jsx
class Module extends Component {
  
  // 模块行高
  static getModuleRowHeight = (attrs) => {
    return 100；
  };
  // 无限重复的模块
  static moduleRenderMode = 'repeat';

  // 事件通信
  static contextTypes = {
    page: PropTypes.object
  };

  componentWillMount() {
    let page = this.context.page;
    if (page && this.props.isFirstRepeatModule) {
      let moduleName = this.props.moduleName;
      // 模拟异步请求数据
      setTimeout(() => {
          // 重置模块数据
          this.props.setDataSource(['异步数据1', '异步数据2']);
      }, 3000);
    }
  }

  render() {
    return (<View>data : {this.props.data}</View>);
  }

}
```

这是一个简单的长列表模块示例，包含了部分约定的内容。对于这些约定规则表现出的不同渲染策略，下文中会详细列出。

### 双促页面的通用渲染逻辑

![](https://gw.alicdn.com/tps/TB1Z1tqPXXXXXb.XXXXXXXXXXXX-730-448.jpg_500x500.jpg)

双促中的页面核心渲染逻辑依赖 rax-page，这个仓库主要负责不同容器上样式差异的抹平、页面级别的事件通信、页面滚动容器的实现、页面模块渲染、页面性能优化、业务级的通用埋点、以及部分页面级的通用功能。

![](https://gw.alicdn.com/tps/TB1Byg3OVXXXXb3XVXXXXXXXXXX-736-444.jpg_500x500.jpg)

上文中有提到，模块分为 app 级别和 page 级别两类。在页面渲染过程中 app 级别的模块会直接渲染。先解释两个概念

* Page：页面的外层包裹容器，主要功能包括不同容器上样式差异的抹平、页面级别的事件通信。
* Block：页面级的滚动容器，用来控制模块的渲染与页面的滚动。

双促的 Block 是页面唯一的全屏滚动容器，所有需要跟随页面滚动的模块都在 Block 内，被定义为 page 级模块。对于页面渲染层面的优化也主要是在 Block 这一层。下面主要介绍一下渲染策略上 Weex 与 H5 的不同，以及这样做带来的收益。

![](https://gw.alicdn.com/tps/TB1la3YOVXXXXbVaXXXXXXXXXXX-718-529.jpg_500x500.jpg)

Weex 页面的渲染主要依赖 Weex 原生提供的 list 标签。在页面的滚动过程中，list 内部非当前可视区域的 cell 标签会被回收，保证整个列表渲染内容不会过多。

借助 list + cell 的方案，为了达到更大的收益，在 Weex 上的实现上就需要拆分出更多的 cell（后面讲双促中的长列表渲染中会详细说明）。一次性渲染出说有的模块必然会很慢，为了让用户能更快的看到页面，在 Weex 上的策略是首屏优先渲染，渲染完成后一次性渲染非首屏模块。这样做的好处是页面可以看到的时候就可以向下顺畅的滑动。

此处和天猫双 11 会场页面不同，天猫的方案是优先加载首屏，非首屏不加载。在页面向下滚动时在首屏底部的 loadmore 时机一次性渲染第二屏幕。淘宝双促会场页面在 Weex 的渲染策略不同，主要解决的问题时首屏电梯的跳转，与向下快速滑动过程中的体验流畅。

![](https://gw.alicdn.com/tps/TB1Ba75OVXXXXcaXVXXXXXXXXXX-698-515.jpg_500x500.jpg)

H5 页面的渲染策略与 Weex 完全不同。吸收了 Weex 页面渲染的部分思路，同时也沿用了往年淘宝大促页面渲染的经验。

对于 H5 页面的渲染，同样区分首屏和非首屏。不同的是首屏渲染结束后非首屏的模块不会继续渲染，甚至模块标签都不会出现在页面上。

这里引入一个站位容器的概念。非首屏的模块默认只渲染出一个和模块真实高度相同的容器。当容器出现在可视区域时（也就是容器的 appear 时机）用真实模块替换掉占位容器。这样做的好处是有效的减少了页面的节点数。当页面电梯跳转到指定楼层时，非可视区域内的模块也不会渲染。

## 双促中的长列表渲染

上文中简单介绍了页面整体渲染的思路，这部分主要讲一下会场中应用最多的长列表的渲染策略。

首先了解一下淘宝双促中的长列表模块，也就是 repeat 类型的模块。一个模块中包含了许多个重复相同样式的行，这样的一个模块可以自身无限加载，一个页面中可以有许多这样的模块。

那么问题来了

* list 下更细化的 cell 性能会更好，这样一个多行模块渲染性能肯定是有问题的
* 页面底部会出发到达底部的事件，显然页面有多个无限加载的列表，这个方案就不适用了

为解决这两个问题，也主要是 Weex 上的渲染问题，我们借助了一些 Weex 页面渲染的方案。
在 Block 容器内的元素，绑定 appear 事件后都可以在进入可视区域或离开可视区域时做一些事情。利用这个机制加上 cell 细化拆分的性能优化方案，就是 repeat 类型模块的基本渲染思路。

![](https://gw.alicdn.com/tps/TB1OPISOVXXXXaRXVXXXXXXXXXX-570-501.jpg_500x500.jpg)

**占位容器的替换与模块的拆分**

Weex 下占位容器是一个高度撑开的 cell，在 repeat 类型模块渲染时，占位容器首先会被替换成真实的单个模块。这个模块可以进行自己业务逻辑的处理，比如请求数据。在模块渲染数据时，会将数据发送给页面的 Block，Block 判断这是一组 repeat 数据时进行真实数据的渲染

![](https://gw.alicdn.com/tps/TB1VFM7OVXXXXavXVXXXXXXXXXX-424-387.jpg_500x500.jpg)

## 小结

Rax 第一次接受淘宝双促的考验，在 native 化、性能、稳定性等多个方面表现优异，达成了预定的目标。在双促中沉淀下的经验也将陆续反哺给其他业务和活动中，在未来会有更多的场景使用 Rax，Rax 体系也将不断完善。

了解更多 [Rax](https://github.com/alibaba/rax) 相关内容，欢迎访问 [alibaba.github.io/rax](https://alibaba.github.io/rax)
Rax 团队敬上。

参考文章：[//taobaofed.org/blog/2017/01/13/rax-in-act/](//taobaofed.org/blog/2017/01/13/rax-in-act/)