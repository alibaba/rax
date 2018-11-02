# Counter 数量选择

Counter 数量选择，拥有默认的展现样式

![](https://gw.alicdn.com/tfs/TB1dsgvRVXXXXbHXXXXXXXXXXXX-255-161.gif)

## 安装

```bash
$ npm install rax-counter --save
```

## 引用

```jsx
import counter from 'rax-counter';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| value | Number |      | 默认数值 |
| start | Number |      | 起始值 |
| end | Number |      | 终止值 |
| onChange | Function |      | 改变值时触发 |
| onComplete | Function |      | 渲染完成触发 |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Counter from 'rax-counter';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
          <Text>选择数量</Text>
          <Counter
            value={1}
            end={5}
            start={0}
            onChange={(num) => {
              this.state.count = num;
            }}
            onComplete={(num) => {
              this.state.count = num;
            }} />
      </View>
    );
  }
}

render(<App />);
```