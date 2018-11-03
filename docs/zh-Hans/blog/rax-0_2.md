---
title: Rax 0.2 发布
date: 20170428
author: 亚城
---

# Rax 0.2 发布

![Rax 0.2](https://img.alicdn.com/tfs/TB11wewQVXXXXbQXFXXXXXXXXXX-806-397.jpg)

2017年3月底 Rax 发布了 0.2 版本，让我们一起看一下 0.2 版本为我们带来了哪些新的思考。

## 一些数据

从开源到 0.2 的发布上线，一些数据印证了 Rax 背后的成长，同时也是 Rax 的一种督促，督促我们要提供一个更好的 Rax 体系。

* 940 commits
* 141 pull requests
* 58 issues
* 2691 stars

## weex-driver

基于 Driver 的设计我们可以做什么？  
下面是一个渲染按钮的简单例子

```
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Button from 'rax-button';

class App extends Component {
  render() {
    return (
      <View className="container">
        <Button onPress={() => {alert('Hello World')}}>Hello World</Button>
      </View>
    );
  }
}

render(<App />);

```

那么问题来了，为什么原生标签也需要 `import`?  
伴随着这个疑问，于是有了一个新的书写方式

```
import {createElement, Component, render} from 'rax';

class App extends Component {
  render() {
    return (
      <div className="container">
        <button onClick={() => {alert('Hello World')}}>Hello World</button>
      </div>
    );
  }
}

render(<App />);
```


![](https://img.alicdn.com/tfs/TB1YvOxQVXXXXcwXFXXXXXXXXXX-835-455.jpg)

目前 Rax 已支持常用的 w3c 标签，下面是一个例子的对比

![](https://img.alicdn.com/tfs/TB15OKhQVXXXXccXVXXXXXXXXXX-832-572.jpg)

未来 Rax 将会提供更多标签，并且尽量的减少不同端之间的差异

## 返回多元素

Rax 已支持返回多个元素，这为我们的业务需求带来了更多的可能性

```
class App extends Component {
  render() {
    return ([
      <span>文字一</span>,
      <span>文字二</span>,
      [
        <span>文字三</span>,
        <span>文字四</span>,
        <span>文字五</span>
      ]
    ]);
  }
}

render(<App />);

```

## 大话 Style

对于样式的书写现在已经支持 css 的书写方式

![](https://img.alicdn.com/tfs/TB1BqqGQVXXXXcNXpXXXXXXXXXX-756-393.jpg)

渐变

```
.graiendContainer {
	width: 750rem;
	height: 100rem;
	background-image: linear-gradient(to right, blue, white);
}
```

fontface

```
@font-face {
	font-family: icon;
	src: url(//at.alicdn.com/t/font_pkm0oq8is8fo5hfr.ttf);
}
```

伪类

```
.pseudoContainer:active {
	background-color: red;
}
```

媒体查询

```
@media screen and (min-width: 400px) {
	.title {
		font-size: 50rem;
		color: red;
	}
}
```

另外，目前已经支持使用 [className 代替 style](https://alibaba.github.io/rax/playground/1ac892d9-39d3-44a3-8d43-cca50b6f82a6)

目前针对不符合以及不规范的写法，会进行强制提醒

![](https://img.alicdn.com/tfs/TB1A3S3QVXXXXcxXXXXXXXXXXXX-1900-746.png)

## 新的站点

Playground 

Web/Weex 双端同步，实时预览编写的示例，同时支持 Rax 推荐的 CSS 写法

![](https://img.alicdn.com/tfs/TB1noSSQVXXXXaFXpXXXXXXXXXX-457-365.png)

新增组件反馈渠道，将问题和建议告诉

![](https://img.alicdn.com/tfs/TB1h4SNQVXXXXa3XFXXXXXXXXXX-873-237.png)

新开放主题市场，让新用户上手有更多的示例项目作为参考

![](https://img.alicdn.com/tfs/TB1dXmZQVXXXXbmXpXXXXXXXXXX-1355-789.png)

站点文档的梳理

工程性文档包括： 基础、进阶、教程、API  
核心组件包括：基础组件、布局组件、表单组件、提示反馈、数据展示、功能组件  

站点全局搜索

![](https://img.alicdn.com/tfs/TB1uXuhQVXXXXXuapXXXXXXXXXX-418-518.png)

Rax 0.2 的发布为我们带来了一些新的思路，在即将到来的 Rax 0.3 我们将会有更多新的想法，尽情期待