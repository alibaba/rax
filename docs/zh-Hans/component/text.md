# Text 文本显示

Text 用于显示文本，在 web 中实际上是一个 span 标签而非 p 标签。 

Text 标签默认展现样式会占满一行，如果有富文本的需求可以 Text 嵌套使用。

![](https://gw.alicdn.com/tfs/TB1CRrMRVXXXXXIapXXXXXXXXXX-259-276.jpg)

## 安装

```bash
$ npm install rax-text --save
```

## 引用

```jsx
import Text from 'rax-text';
```

## 属性

| 名称            | 类型       | 默认值  | 描述       |
| :------------ | :------- | :--- | :------- |
| numberOfLines | Number   |      | 行数       |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Text from 'rax-text';

render(<Text style={{
  color: '#3c3c3c',
  fontSize: '50rem'
}}>文本内容 </Text>);
```

## 复杂示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import Text from 'rax-text';
import View from 'rax-view';

class App extends Component {
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>我是文本内容</Text>
      </View>
    );
  }
}
const styles = {
  container: {
    width: 750
  },
  text: {
    color: 'red',
    fontSize: '50rem'
  }
};
render(<App />);
```
