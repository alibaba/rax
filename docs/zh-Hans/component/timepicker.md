# TimePicker 时间选择

TimePicker 时间选择组件，调用系统原生选择框实现

![](https://gw.alicdn.com/tfs/TB1p1zYRVXXXXc6XVXXXXXXXXXX-240-390.jpg)

## 安装

```bash
$ npm install rax-timepicker --save
```

## 引用

```jsx
import TimePicker from 'rax-timepicker';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| selectedValue | String |      | 选中值（示例：01:01） |
| onTimeChange | Function |      | 时间选择 |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import TimePicker from 'rax-timepicker';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
        <Text>选择时间</Text>
        <TimePicker 
          selectedValue={'10:10'}
        />
      </View>
    );
  }
}

render(<App />);
```