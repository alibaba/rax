# 容器能力差异

Rax 是一个跨容器的渲染引擎。底层依赖各个容器的实现，所以容器能力的差异也会在 Rax 中有所体现。

主要的容器能力差异来自于 Web 和 Weex 环境。Weex 是一个跨平台解决方案，Web 平台只是其一种运行环境，除此之外 Weex 还可以在 Android 和 iOS 客户端中运行。原生开发平台和 Web 平台之间的差异，在功能和开发体验上都有一些差异。

## 样式能力差异

Rax 在上层除了很好的支持 Flexbox 之外，与 Weex 相同，仅支持这里枚举出来的样式属性：[通用样式规则](https://weex.apache.org/cn/references/common-style.html)

## 全局 API 差异

由于 Weex 中没有 BOM 即浏览器对象模型，是浏览器环境为 javascript 提供的接口。Weex 在原生端没有并不基于浏览器运行，不支持浏览器提供的 BOM 接口。 Rax Framework 参照 W3C 规范，提供了以下在 Weex 和 Web 环境一致的全局API: [这里是全局 API](/guide/api)

## 有限的事件类型

由于 Weex 中的事件是由原生组件捕获并触发的，行为和浏览器中有所不同，事件中的属性也和 Web 中有差异。所以并不是所有的原 Web 事件类型都支持，只支持特定的一些时间操作，同时并不区分事件的捕获阶段和冒泡阶段。 可以参考：[事件处理](/guide/event-handle)

