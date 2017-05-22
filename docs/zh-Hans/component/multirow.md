# MultiRow 多列布局

面向移动端页面的多列布局组件。

## 安装

```bash
$ npm install rax-multirow --save
```

## 引用

```jsx
import MultiRow from 'rax-multirow';
```

## 属性

| 名称         | 类型       | 默认值  | 描述                           |
| :--------- | :------- | :--- | :--------------------------- |
| renderCell | Function |      | 模板方法（必需）                     |
| dataSource | List     |      | 需要渲染的数据，与 renderCell 配合使用（必需） |
| cells      | Number   | 1    | 每行包含几列，默认1列（必需）              |

## 多列布局基本示例

![](https://img.alicdn.com/tps/TB12k55KVXXXXXfXVXXXXXXXXXX-415-230.png)

```jsx
// demo
import {createElement, Component, render} from 'rax';
import MultiRow from 'rax-multirow';
import View from 'rax-view';

class Demo extends Component {
  render() {
    return (
      <View style={{width: 750}}>
        <MultiRow dataSource={['tom', 'jeck', 'lilei', 'hanmeimei']} 
         cells={2} renderCell={(num, index) => { return <View>{num}</View> }} 
       />
      </View>
    );
  }
}

render(<Demo />);
```
