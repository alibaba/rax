# Link 链接

Link 是基础的链接组件，同 a 标签。它带有默认样式 textDecoration: 'none'。  

在浏览器中，同我们熟悉的 a 标签，使用 Link 标签并不能新开一个 webview ，它只是在当前的 webview 中做页面的跳转。

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | 点击事件 |

同时支持任意自定义属性的透传

## 引用

```jsx
import Link from 'rax-link';
```

## 示例

```jsx
<Link href="//path/to/url"}>这是一个链接</Link>
```
