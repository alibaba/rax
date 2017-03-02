# TouchableHighlight 点击容器

TouchableHighlight 定义简单的 touch 事件。
使用 TouchableHighlight 我们不用担心复杂的视图结构，也就是说我们不必再担心类似以前 tap 点击穿透这样的问题了。
对于复杂的手势事件，我们可以使用 [rax-panresponder](/guide/panresponder) 。

## 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onPress|Function||点击事件|

同时支持任意自定义属性的透传

## 引用

```jsx
import {TouchableHighlight} from 'rax-components';
```

## 示例

```jsx
<TouchableHighlight onPress={() => { console.log('hello'); }}>Click Me</TouchableHighlight>
```
