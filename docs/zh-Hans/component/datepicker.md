# DatePicker 日期选择

DatePicker 日期选择组件，调用系统原生选择框实现

![](https://gw.alicdn.com/tfs/TB1CkkpRVXXXXaLXpXXXXXXXXXX-240-390.jpg)

## 安装

```bash
$ npm install rax-datepicker --save
```

## 引用

```jsx
import DatePicker from 'rax-datepicker';
```

## 属性

| 名称      | 类型       | 默认值  | 描述   |
| :------ | :------- | :--- | :--- |
| selectedValue | String |      | 选中值（示例：2017-01-01） |
| onDateChange | Function |      | 日期切换 |
| minimumDate | String |      | 日期选择最小范围（示例：2017-01-01） |
| maximumDate | String |      | 日期选择最大范围（示例：2017-01-01） |

## 基本示例

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import DatePicker from 'rax-datepicker';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
          <Text>选择日期</Text>
          <DatePicker 
            selectedValue={'2000-01-01'}
            minimumDate={'2000-01-01'}
            maximumDate={'2001-01-01'}
            onDateChange={(date) => {
              console.log('组件date', date);
            }}  />
      </View>
    );
  }
}

render(<App />);
```