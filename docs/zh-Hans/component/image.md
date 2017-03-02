# Image 图片

基础类型的图片实现

## 属性

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|scoure|Object||设置图片的 uri|
|style|Object||样式 图片不设置宽高则默认为0x0|
|resizeMode|String||决定当组件尺寸和图片尺寸不成比例的时候如何调整图片的大小|

同时支持任意自定义属性的透传。  

其中 resizeMode 支持的值包括：contain、cover、stretch、center、repeat。

## 引用

```jsx
import { Image } from 'rax-components';
```

## 示例

```jsx
render() {
  return (
    <Image source={{
      uri: '//img.alicdn.com/image.png'
    }} style={{
      width: '100rem',
      height: '100rem',
    }}
    resizeMode={'cover'}   // 也可以放在style里
    />
  );
}
```

这里的 Image 组件只提供了基础的图片展示，更好的显示图片可以使用 Picture 组件。 