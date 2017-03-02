# Text 文本显示

Text 用于显示文本，在 web 中实际上是一个 span 标签而非 p 标签。  

Text 标签不支持嵌套，默认展现样式会沾满行。

## 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|onPress|Function||点击事件|
|id|String||指定 id|
|className|String||class 名称|
|numberOfLines|Number||行数|

## 引用

```jsx
import {Text} from 'rax-components';
```

## 示例

```jsx
<Text style={{
  color: '#3c3c3c',
  fontSize: '20rem'
}}>文本内容 </Text>
```
