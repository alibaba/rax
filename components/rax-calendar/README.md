# Calendar 日历

[![npm](https://img.shields.io/npm/v/rax-calendar.svg)](https://www.npmjs.com/package/rax-calendar)

Calendar selector component

## Install

```bash
$ npm install rax-calendar --save
```

## Import

```jsx
import Calendar from 'rax-calendar';
```

## Props

| name      | type       | default  | describe   |
| :------------- | :------- | :--------- | :----------- |
| startDate      | String   | ''         | optional start time      |
| endDate        | String   | ''         | optional end time      |
| titleFormat    | String   | MMMM YYYY  | month rendering format      |
| dateFormat     | String   | YYYY-MM-DD | return date format      |
| weekStart      | Num      | 1          | start the date as a week |
| prevButtonText | String   | ''         | display text for month switch button  |
| nextButtonText | String   | ''         | display text for month switch button  |
| onDateSelect   | Function | ''         | select a date       |
| onTouchPrev    | Function | ''         | last month         |
| onTouchNext    | Function | ''         | next month         |

## Example

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
          titleFormat={'YYYY-MM'}
          prevButtonText={'last month'}
          nextButtonText={'next mourh'}
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