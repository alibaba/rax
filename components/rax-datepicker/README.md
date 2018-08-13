# DatePicker 

[![npm](https://img.shields.io/npm/v/rax-datapicker.svg)](https://www.npmjs.com/package/rax-datapicker)

DatePicker call system native selection box

## Install

```bash
$ npm install rax-datepicker --save
```

## Import

```jsx
import DatePicker from 'rax-datepicker';
```

## Props

| name      | type       | default  | describe   |
| :------ | :------- | :--- | :--- |
| selectedValue | String |      | selected value（2017-01-01） |
| onDateChange | Function |      | date switch |
| minimumDate | String |      | date selection minimum range（2017-01-01） |
| maximumDate | String |      | maximum date selection（2017-01-01） |

## Example

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
          <Text>select date</Text>
          <DatePicker 
            selectedValue={'2000-01-01'}
            minimumDate={'2000-01-01'}
            maximumDate={'2001-01-01'}
            onDateChange={(date) => {
              console.log('date: ', date);
            }}
            style={styles.picker} />
      </View>
    );
  }
}

render(<App />);
```