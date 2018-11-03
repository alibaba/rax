---
title: 什么是 Rax，以及 Rax 的特点
date: 20170426
author: 大果
---

# 什么是 Rax，以及 Rax 的特点

<img src="https://img.alicdn.com/tps/TB1LxebPVXXXXaHXpXXXXXXXXXX-900-500.png" style="text-align: center;"/>

Rax is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rax.

## Rax

2015 年双十一，Weex 的方案开始逐步使用，经过这次试水，证明了这套方案未来的场景及可行性，接着 2016 年 Weex 开始进入快速发展的阶段。但是使用 Weex 就意味着必须用 Vue 的语法，这对于整个团队来说是一个不小的挑战：PC 场景下的项目，小伙伴们普遍基于 React 开发，已经有了相当多的经验与沉淀。如果无线的项目要采用一个不同方案（Vue）去做，强推未必会不奏效，但是小伙伴们大概会伤心吧。

于是我们尝试将 React 与 Weex 结合起来，但是由于方案太过 hack 导致各种问题，遂无奈放弃。接着 Rax 的方案应运而生：「Rax 基于 React 的标准，支持在不同容器中渲染，当前最重要的容器即 Weex 和 Web」。

## Rax 与 React

React 是一种标准，Rax 是对该标准的一个实现。Rax 只是无线端的解决方案，与 React 并无冲突。事实上淘宝 PC 端的新项目，依然主要是基于 React。当然，Rax 跟 Preact 之类的方案也有本质区别，前者偏向于解决多端问题，后者偏向于解决性能问题，具体可参考下文「Rax 的特点」。

## Rax 的特点

**1、设计上支持不同容器**

Rax 在设计上抽象出 Driver 的概念，用来支持在不同容器中渲染，比如目前所支持的：Web, Weex, Node.js. 基于 Driver 的概念，未来即使出现更多的容器（如 VR 等），Rax 也可以从容应对。Rax 在设计上尽量抹平各个端的差异性，这也使得开发者在差异性和兼容性方面再也不需要投入太多精力了。

**2、体积足够小**

如上文所说，Rax 是一个面向无线端的解决方案，因此自身的体积对于性能来讲就显得非常重要。Rax 压缩 + gzip 后的体积是 8.0kb, 相比 React 的 43.7kb, 对于无线端友好了很多。

**3、支持返回多个同级节点**

任何用过 React 的同学大概都踩过同一个坑：方法返回了多个同级节点导致报错。在设计上 React 只能返回单个节点，因此页面上或多或少会产生一些冗余的节点，这在 PC 端并没有太多问题，然而在无线 Android 端嵌套层级越多，应用的 crash 率会不断提高，这一点在低端 Android 机上表现尤其明显。因此 Rax 支持了返回多个同级节点的功能，如：

```jsx
import {createElement, Component, render} from 'rax';

class Test extends Component {
  render() {
    return [1, 2, 3].map((item) => {
      return <p>{item}</p>;
    });
  }
}
```

这一特性可以有效减少页面的嵌套层级，从而减少应用因嵌套层级过多而出现的 crash 问题。

**4、标准化**

在上文里，我们不断的提各个端的一致性，一致则必有规范可依，Rax 遵循 W3C 标准，比如在 Weex 容器中已经可以直接调用 navigator, document, location, alert 等 W3C 的标准 API.

当然，受限于各个端的差异，标准化的道路还很长，「更标准化」这也是 Rax 未来的重要目标之一。

## 未来

Write once, run everywhere. 这是口号，亦是目标。Rax 未来会在更多的端上不断探索，比如 VR/AR, 甚至之前微博上有同学提出的是否可以用 Rax 写微信小程序，也是一个蛮有意思的想法。

对于开发者来说，当越来越多的端不断出现在眼前时，我们应该如何应对？是通过不断的踩坑来整理一份长长的 checklist, 然后做项目时一一对照？ 或者让我们一起来探索 Rax?

了解更多 [Rax](https://github.com/alibaba/rax) 相关内容，欢迎访问 [alibaba.github.io/rax](https://alibaba.github.io/rax)
Rax 团队敬上。



参考文章：//taobaofed.org/blog/2017/02/10/why-rax/
