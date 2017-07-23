# Calendar 日历

日历选择器组件，带有默认的展现样式。

![](https://gw.alicdn.com/tfs/TB1uxYIRVXXXXXQapXXXXXXXXXX-255-300.gif)

## 安装

```bash
$ npm install rax-calendar --save
```

## 引用

```jsx
import Calendar from 'rax-calendar';
```

## 属性

| 名称             | 类型       | 默认值        | 描述           |
| :------------- | :------- | :--------- | :----------- |
| startDate      | String   | ''         | 可选的起始时间      |
| endDate        | String   | ''         | 可选的结束时间      |
| titleFormat    | String   | MMMM YYYY  | 月份的渲染格式      |
| dateFormat     | String   | YYYY-MM-DD | 返回的日期格式      |
| weekStart      | Number      | 1          | 把周几作为一个星期的开始 |
| prevButtonText | String   | ''         | 月份切换按钮的显示文案  |
| nextButtonText | String   | ''         | 月份切换按钮的显示文案  |
| onDateSelect   | Function | ''         | 选中某个日期       |
| onTouchPrev    | Function | ''         | 上一个月         |
| onTouchNext    | Function | ''         | 下一个月         |

## 基本示例

```jsx
// demo
import { createElement, render, Component } from 'rax';
import Calendar from 'rax-calendar';
import View from 'rax-view';

class App extends Component {
  state = {
    selectedDate: '2017-01-01'
  }
  
  render() {
    console.log(this.state.selectedDate);
    return (
      <View>
        <Calendar
          ref="calendar"
          eventDates={['2017-01-02', '2017-01-05', '2017-01-28', '2017-01-30']}
          startDate={'2017-01-01'}
          endDate={'2017-07-01'}
          titleFormat={'YYYY年MM月'}
          prevButtonText={'上一月'}
          nextButtonText={'下一月'}
          weekStart={0}
          onDateSelect={(date) => this.setState({ selectedDate: date })}
          onTouchPrev={() => console.log('Back TOUCH')}
          onTouchNext={() => console.log('Forward TOUCH')}
        />
      </View>
    );
  }
}

render(<App />);
```
