# ScrollView 滚动容器

ScrollView 是一个包装了滚动操作的组件。一般情况下需要一个确定的高度来保证 ScrollView 的正常展现。

![](https://gw.alicdn.com/tfs/TB1SV3iRVXXXXcAXpXXXXXXXXXX-255-383.gif)  

## 安装

```bash
$ npm install rax-scrollview --save
```

## 引用

```jsx
import ScrollView from 'rax-scrollview';
```

## 属性

| 名称                           | 类型      | 默认值  | 描述                                       |
| :----------------------------- | :------- | :--- | :--------------------------------------- |
| scrollEventThrottle            | Number   |      | 这个属性控制在滚动过程中，scroll事件被调用的频率（默认值为100），用于滚动的节流 |
| horizontal                     | Boolean  |      | 设置为横向滚动                                  |
| showsHorizontalScrollIndicator | Boolean  |      | 是否允许出现水平滚动条，默认true                       |
| showsVerticalScrollIndicator   | Boolean  |      | 是否允许出现垂直滚动条，默认true                       |
| onEndReachedThreshold          | Number   |      | 设置加载更多的偏移，默认值为500                        |
| onEndReached                   | Function |      | 滚动区域还剩 `onEndReachedThreshold` 的长度时触发    |
| onScroll                       | Function |      | 滚动时触发的事件，返回当前滚动的水平垂直距离 |

## 方法

| 名称  | 描述  |
| :------ | :------- |
| scrollTo    | 滚动到指定位置（参数示例：{x:0, y:100}） |

## 使用示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import ScrollView from 'rax-scrollview';
import Text from 'rax-text';

render(
<ScrollView onEndReachedThreshold={300} onEndReached={() => {}}>
  <Text style={{
    color:'#ffffff',
    margin:'5rem',
    fontSize:'100rem',
    backgroundColor:"blue"
  }}>
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
      Shake or press menu button for dev menuShake or press menu button for dev menu
  </Text>
</ScrollView>
);
```
