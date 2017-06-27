# Touchable 可点击容器

Touchable 定义简单的 touch 事件。
使用 Touchable 我们不用担心复杂的视图结构，也就是说我们不必再担心类似以前 tap 点击穿透这样的问题了。
对于复杂的手势事件，我们可以使用 [rax-panresponder](/guide/panresponder) 。

![](https://gw.alicdn.com/tfs/TB1RdcyRVXXXXalXXXXXXXXXXXX-255-334.gif)

## 安装

```bash
$ npm install rax-touchable --save
```

## 引用

```jsx
import Touchable from 'rax-touchable';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | 点击事件 |

同时支持任意自定义属性的透传

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Touchable from 'rax-touchable';

render(<Touchable onPress={() => { alert('hello'); }}>Click Me</Touchable>);
```
