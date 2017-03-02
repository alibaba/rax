# Calendar 日历

## API

|名称|类型|默认值|描述|
|:---------------|:--------|:----|:----------|
|startDate|String|''|可选的起始时间|
|endDate|String|''|可选的结束时间|
|titleFormat|String|MMMM YYYY|月份的渲染格式|
|dateFormat|String|YYYY-MM-DD|返回的日期格式|
|weekStart|Num|1|把周几作为一个星期的开始|
|prevButtonText|String|''|月份切换按钮的显示文案|
|nextButtonText|String|''|月份切换按钮的显示文案|
|onDateSelect|Function|''|选中某个日期|
|onTouchPrev|Function|''|上一个月|
|onTouchNext|Function|''|下一个月|

## 兼容性

h5 可用

## 使用示例

```jsx
import {Calendar} from 'rax-calendar';

<Calendar
  ref="calendar"
  eventDates={['2016-07-03', '2016-07-05', '2016-07-28', '2016-07-30']}
  startDate={'2016-05-03'}
  endDate={'2016-07-03'}
  titleFormat={'YYYY年MM月'}
  prevButtonText={'上一月'}
  nextButtonText={'下一月'}
  weekStart={0}
  onDateSelect={(date) => this.setState({ selectedDate: date })}
  onTouchPrev={() => console.log('Back TOUCH')}
  onTouchNext={() => console.log('Forward TOUCH')}
/>
```