# View 容器

View 是最基础的组件，它支持Flexbox、touch handling等功能，并且可以任意嵌套。  

不论在什么容器中，View 都直接对应一个容器的原生视图，就像 web 中的 div 一样。  

支持任意自定义属性的透传。

![](https://gw.alicdn.com/tfs/TB13lP8RVXXXXbVXFXXXXXXXXXX-242-150.jpg)

## 安装

```bash
$ npm install rax-view --save
```

## 引用

```jsx
import View from 'rax-view';
```

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';

render(<View style={{
      padding: 30,
    }}>
   <View style={{
      width: 300,
      height: 300,
      backgroundColor:"red"
    }}/>
   <View style={{
      width: 300,
      height: 300,
      backgroundColor:"green",
      position: 'absolute',
      top: 20,
      left: 20,
    }}/>
   <View style={{
      width: 300,
      height: 300,
      backgroundColor:"yellow",
      position: 'absolute',
      top: 80,
      left: 210,
    }}/>
</View>);
```