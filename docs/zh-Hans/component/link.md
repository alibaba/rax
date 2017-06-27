# Link 链接

Link 是基础的链接组件，同 a 标签。它带有默认样式 `textDecoration: 'none'`。  

在浏览器中，同我们熟悉的 a 标签，使用 Link 标签并不能新开一个 `webview` ，它只是在当前的 `webview` 中做页面的跳转。

![](https://gw.alicdn.com/tfs/TB1rbYSRVXXXXbDaXXXXXXXXXXX-255-367.gif)

## 安装

```bash
$ npm install rax-link --save
```

## 引用

```jsx
import Link from 'rax-link';
```

## 属性

| 名称      | 类型       | 默认值  | 描述     |
| :------ | :------- | :--- | :----- |
| onPress | Function | null | 响应点击事件 |

同时支持任意自定义属性的透传

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Link from 'rax-link';

const styles = {
  container: {
    width: 750
  }
};

class App extends Component {
  render() {
    const url = "https://taobao.com";
    return (
      <View style={styles.container}>
        <Link href={url}>这是一个链接</Link>
      </View>
    );
  }
}

render(<App />);
```
