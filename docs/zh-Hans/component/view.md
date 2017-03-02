# View 容器

View 是最基础的组件，它支持Flexbox、touch handling等功能，并且可以任意嵌套。  

不论在什么容器中，View 都直接对应一个容器的原生视图，就像 web 中的 div 一样。  

支持任意自定义属性的透传。

## 引用

```jsx
import {View, Text} from 'rax-components';
```

## 示例

```jsx
<View>
  <Text>Hello World!<Text>
</View>
```