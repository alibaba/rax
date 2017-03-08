# Touchable 可点击容器

Touchable 定义简单的 touch 事件。
使用 Touchable 我们不用担心复杂的视图结构，也就是说我们不必再担心类似以前 tap 点击穿透这样的问题了。
对于复杂的手势事件，我们可以使用 [rax-panresponder](/guide/panresponder) 。

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | 点击事件 |

同时支持任意自定义属性的透传

## 引用

```jsx
import Touchable from 'rax-touchable';
```

## 示例

```jsx
<Touchable onPress={() => { console.log('hello'); }}>Click Me</Touchable>
```
