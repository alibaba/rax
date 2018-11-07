---
title: Rax 系列教程（长列表）
date: 20180315
author: 亚城
---

# Rax 系列教程（长列表）

![Rax 系列教程（长列表）](https://gw.alicdn.com/tfs/TB1GMRPdKOSBuNjy0FdXXbDnVXa-900-500.jpg)

## [](#引子 "引子")引子

Rax 提供的长列表标签有很多，在什么场景下使用什么列表组件，怎样选择列表组件性能会更好，这些问题可能会给刚接触 Rax 的同学带来困扰。本文结合 Rax 0.5 发布版本对列表能力进行一次详细的梳理。

## [](#如何让页面滚动 "如何让页面滚动")如何让页面滚动

在开始正题之前先说说为什么要有长列表的概念，以及如何让页面可以滚动。

传统的 Web 页面天生在浏览器里就是可以滚动的，我们额外引入一个滚动容器的概念好像比较多余。但当我们做跨容器开发时，这一层概念就变的有意义。native 的页面天生不可滚动，需要借助滚动容器的滚动能力，比如 iOS 中的 UITableView、Android 中的 RecyclerView，通过组件的方式让页面的部分内容可以滚动。

写好了一个页面发现在 Weex 上是白屏，很可能就是滚动容器没有撑开。真实需求中我们往往想要整个页面滚动，首先要解决的就是屏幕高度问题。下面这段是比较常用的页面占满全屏的手段。

```
<View style={{ position: 'position', top: 0, bottom: 0, width: 750 }}>
    <RecyclerView />
</View>
```

对于动态设置高度的场景，我们可以通过 dom.getComponentRect 方法得到页面可是区域的高度。

```
let dom = require('@weex-module/dom');
dom.getComponentRect('viewport', (e) => {
  console.log(e.result, e.size);
});
```

如此以来我们的页面就可以自由滚动，通过下拉刷新、加载更多能力的组合让我们的滚动容器更贴近 Web 体验。

## [](#现有列表与能力范围 "现有列表与能力范围")现有列表与能力范围

Rax 目前提供了很多列表组件，相关基础组建以及主要特点如下：

*   rax-scrollview (水平滚动推荐方案)
    *   Weex 上实现是 slider，支持垂直和水平的滚动
    *   无法做 cell 回收，内容过多时会有性能问题
*   rax-recyclerview (最常用高性能推荐方案)
    *   Weex 实现是 list，可回收的长列表，不可水平滚动
    *   性能上有很大优化，滚动体验流畅
*   rax-listview (RN 习惯)
    *   RecyclerView 的上层包装，对标 RN 的能力
    *   对性能和列表多样化展示有更高要求的推荐使用 RecyclerView
*   rax-waterfall (瀑布图场景推荐)
    *   底层实现上也是 list 的一个扩展，在 API 能力上向 ListView 靠拢

## [](#长列表基础能力 "长列表基础能力")长列表基础能力

作为最基础的推荐实现方案，以 rax-recyclerview 为例，介绍几个列表的重要功能

### [](#onEndReached "onEndReached")onEndReached

当页面滚动到底部时，往往我们会有继续加载的操作，Weex 上 loadmore 事件。对应到 rax-recyclerview 就是 onEndReached 属性。

在 Weex 中 onEndReached 出发后如果 cell 个数没有发生变化，文档的高度没有继续撑开，则不会重复加载 onEndReached，这种保护措施让我们避免了重复加载，但同时也引入了另外一个问题。

![](https://gw.alicdn.com/tps/TB1ZNSJOVXXXXXMXpXXXXXXXXXX-716-352.png_400x400.jpg)

上面这个例子展示的逻辑是切换 tab 改变同一 list 的功能，当我切换 tab 后更新列表的数据条数与上一个 tab 触发 onEndReached 的位置相同时，会发现 onEndReached 失效了。原因就是不会重复触发导致的，解决方案就是使用 列表的 resetScroll 方法重置列表的滚动情况。下面是示例代码：

```
this.refs.list.resetScroll();
```

### [](#refresh "refresh")refresh

下拉刷新是 web 浏览器的原生体验，Weex 上的模拟是通过列表标签内的 RefreshControl 组件实现，注意的是 RefreshControl 需要放在列表的第一个元素，如果有标签在 refresh 之前会导致 RefreshControl 无法正常展示。

### [](#appear "appear")appear

在上手教程中介绍过这个事件，onAppear 事件可以让我们在元素出现的时候做一些事情，在 Web 上 Rax 的 framework 同样提供了 Appear 事件用来抹平与 Weex 的差异。appear 的一些注意点如下

*   appear 需要绑定在 滚动容器内不，不然 Weex 上无法生效
*   appear 的能力实际上是基于 onScroll，过多的 appear 对于滚动性能会稍有影响
*   appear 是一个滑动过程中可能频繁触发的事件，在这里的 setState 逻辑需要自己把控好

### [](#onScroll "onScroll")onScroll

滚动过程中我们需要实时的做一些操作时会用到 onScroll，onScroll 时计 setState 更新内容是一个成本很大的事情，需要注意是否过频繁的操作会引起页面的卡顿，另外在滚动过程中的动画操作我们推荐使用 [BindingX](https://github.com/alibaba/bindingx) ，这个实现方案可以减小通信成本达到性能的提升，如下示例：

[完整 demo 在这里](https://jsplayground.taobao.org/raxplayground/2c9d1551-fd85-4c76-9144-10c63b6a9fe9)，下面代码展示滚动过程中一个元素的动画

```
  binding.bind({
    eventType: 'scroll',
    anchor: list,
    props: [
      {
        element: image,
        property: 'transform.translateY',
        expression: image_origin
      },
    ]
  }, function(e) {
  });
```


## [](#页面的组织 "页面的组织")页面的组织

### [](#简单可滚动页面 "简单可滚动页面")简单可滚动页面

![](https://gw.alicdn.com/tps/TB1VLrpMVXXXXaQXpXXXXXXXXXX-406-723.gif)

撑满设备屏幕的 View 内部的滚动容器默认就是高度撑开的，此种场景是我们业务中用到最多也是最基础的滚动场景。

```
<View style={{ position: 'position', top: 0, bottom: 0, width: 750 }}>
    <RecyclerView />
</View>
```

### [](#页面部分固定 "页面部分固定")页面部分固定

![](https://img.alicdn.com/tps/TB1tWO2KVXXXXaFXVXXXXXXXXXX-392-701.gif)

如果页面中有部分是固定的其余部分可以滚动我们可以采用如下方式，这种场景通常用来作为顶部导航或者底部 bar。

```
<View style={{ position: 'position', top: 0, bottom: 0, width: 750 }}>
    <View style={{ height: 80 }} />
    <RecyclerView />
</View>
```

### [](#模块吸顶 "模块吸顶")模块吸顶

![](https://img.alicdn.com/tps/https://gw.alicdn.com/tfs/TB1Ie46XKSSBuNjy0FlXXbBpVXa-272-480.gif)

楼层吸顶是一个较为常见的会场类页面需求，通常的实现方案是 RecyclerView.Header 标签，需要注意的是 Rax 0.5 版本中还未对 RecyclerView.Header 做 web 上的实现，需要业务上处理，可以将样式设置为 fixed，或者将要吸顶元素拷贝到列表外部。上面的演示图效果更为复杂，使用到了 binding。

```
<View style={{ position: 'position', top: 0, bottom: 0, width: 750 }}>
    <RecyclerView>
      <RecyclerView.Header />
    </RecyclerView>
</View>
```

### [](#横滑切换多页面 "横滑切换多页面")横滑切换多页面

![](//gw.alicdn.com/mt/LB18hRSQpXXXXbPXXXXXXXXXXXX-375-667.gif)

性能的优化带来的是体验的提升，我们可以不再拘泥于刷新页面来切换页面。这就有了横滑翻页的尝试。其主要思路就是通过手势来进行横滑拖拽。

```
<View style={{width: 750, position: 'absolute', top: 0, bottom: 0}}>
    <Tab ...  />
    <TabController ... >
      <TabPanel><SamplePage index="0" /></TabPanel>
      <TabPanel><SamplePage index="1" /></TabPanel>
      <TabPanel><SamplePage index="2" /></TabPanel>
    </TabController>
  </View>
```

此处我们还将引申出另外一个文章，《Rax 系列教程（单页）》敬请期待

### [](#模拟滚动嵌套 "模拟滚动嵌套")模拟滚动嵌套

![](https://img.alicdn.com/tps/https://gw.alicdn.com/tfs/TB15wTxauuSBuNjy1XcXXcYjFXa-272-480.gif)

随着页面交互形式的越来越复杂，更丰富的体验效果不断的出现。如上图横滑页面的部分上方出现一个公共区域。目前业务中较的实现方案是滚动下方的容器过程中去动态改变一个静态的 header，页面组织形式如下：

```
  <View style={{width: 750, position: 'absolute', top: 0, bottom: 0}}>
    <Parallax> header 部分 </Parallax>
    <Tab ...  />
    <TabController ... ／>
  </View>
```

其中 Parallax 的部分也可以用 View 加动画的方式实现，不过这种效果毕竟是模拟一个滚动嵌套，还不完美。

## [](#长列表使用技巧 "长列表使用技巧")长列表使用技巧

### [](#水平与垂直滚动嵌套 "水平与垂直滚动嵌套")水平与垂直滚动嵌套

垂直滚动容器中往往会有水平横滑的场景，实现的方案有很多种，比如 Slider 组件可以完成水平的滚动轮播，Tabheader 可以作为可横滑的 tab，如果想要更佳令我我们还可以用 ScrollView 自己实现一个水平的滚动。

在垂直与水平嵌套的场景中需要注意一点，就是水平滚动容器并不能尽兴节点的回收，所以横滑内容过长可能会引发性能问题，需要合理规划横滑内容。

### [](#手势冲突 "手势冲突")手势冲突

手势动画我们可以用与 RN 能力对其的 PanResponder，当然我们更推荐性能更加优秀的 [BindingX](https://github.com/alibaba/bindingx) 手势，在 Rax 的标签元素上绑定 onTouchStart 这样的事件也是支持的。在这些能力支持的基础上有一些坑也是需要我们注意的，比如手势与滚动行为相互吃掉。垂直长列表默认就有上下滚动的行为，此时我们想要做一些手势处理的需求时可能要先考虑一下手势的方向会不会被滚动容器的滚动所影响。

一种情况是垂直滑动手势，页面垂直滚动时尽量避免垂直的手势行为。虽然我们可以通过禁用滚动等方式模拟手势滑动，但目前 iOS 和安卓仍然有支持程度不同的兼容问题。所以如果垂直滑动时想要做一些事情，推荐使用 onScroll 事件 或者 BindingX 的 scroll 方法来解决。

![](https://gw.alicdn.com/tfs/TB1.kFcRXXXXXbhapXXXXXXXXXX-826-330.png)

另一种情况是水平横画手势，如上图。页面由 4 个 tab 组成，横画页面可以切换 tab，此事如果我们对容器再绑定水平的华东手势，就会对横画切 tab 的行为造成影响。为了避免这种冲突，我们推荐使用原生 slider 进行页面内的水平滚动操作，省区我们自己处理这一层冲突。

### [](#电梯跳转 "电梯跳转")电梯跳转

![](https://gw.alicdn.com/tfs/TB1BdBdaSBYBeNjy0FeXXbnmFXa-649-483.png_400x400.jpg)

每年大促的页面中我们几乎都能看到电梯的身影，实现的基本思路是 Weex 下利用 Weex dom 模块的 scrollToElement 方法跳转到页面的制定元素，h5 下用锚点进行条转。此时需要页面楼层之间斤两撑开，避免页面抖动的情况。

还有一种方式是利用滚动容器的 scrollTo 方法跳转指定举例，此方式需要在跳转前严格计算每个楼层的高度。

### [](#模块的顺序保证 "模块的顺序保证")模块的顺序保证

在长列表数据更新或者模块更新的过程中，如果没有指定每个 cell 之间的顺序就可能出现楼层错位问题，指定的方式就是每个 cell 指定唯一的 key。如果摸个模块返回的是多个 cell 的暑促，那除了每个 cell 指定 key 这个模块也需要指定一个唯一的 key。

### [](#视差滚动 "视差滚动")视差滚动

视差滚动需求目前提供了两种解决方案，一种是 Weex 的 parallax 标签，另一种是使用 BindingX 进行视差滚动的模拟。

## [](#Web-与-Weex-列表上的不同 "Web 与 Weex 列表上的不同")Web 与 Weex 列表上的不同

此处说明配合 Rax 0.5 版本。

*   下拉刷新： web 有原生的下拉刷新体验，RefreshControl 仅有 weex 的实现
*   吸顶：web 上没有实现 RecyclerView.Header 的吸顶效果
*   电梯：楼层跳转方式不同，web 上采用锚点或距离的方式，Weex 采用 scrollToElement 方法
*   回收机制：web 上没有节点的回收
*   appear：weex 原生支持 appear，并且只能在滚动容器内部才能生效，web 是根据元素是否在可视区域进行模拟的

## [](#长列表的性能注意点 "长列表的性能注意点")长列表的性能注意点

*   当列表数据过长时，不推荐用 ScrollView 作为页面级别的滚动容器，RecyclerView 有更好的滚动性能（非可视区域 cell 的回收机制）
*   RecyclerView 的 cell 拆分粒度越细越好
*   同一 cell 内部不要放置太多图片，保持尽量简洁一致的 cell 结构利于原生 tableview cell 视图复用
*   cell recycle = false 属性会破坏 cell 的内存回收机制
*   WaterFall 的 header 没有回收机制，不建议瀑布图头部 header 过长
*   嵌套太深不利于回收，建议最大深度不超过 15
*   列表内如果有大量视频需要控制视频标签数量，建议非可视区域的视频区块用图片代替
*   更新列表数据时，如果 cell 内部有类似事件绑定 onClick={()=>{}} 每次渲染会实例化新的 function 导致列表内容 diff 前后对比不一致，会触发 cell 的重新 render
*   为避免长列表内元素的重复渲染，可在组件实现上 shouldComponentUpdate 时机可以将其 return 掉
*   列表内存暴涨、滑动卡顿 优先排查页面是否有频繁的 setState

> 题图：[https://unsplash.com/photos/V7gVxlUE5aY](https://unsplash.com/photos/V7gVxlUE5aY) By @Toa Heftiba