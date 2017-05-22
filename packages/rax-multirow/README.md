# MultiRow

[![npm](https://img.shields.io/npm/v/rax-multirow.svg)](https://www.npmjs.com/package/rax-multirow)

Multi column layout component

## Install

```bash
$ npm install rax-multirow --save
```

## Import

```jsx
import MultiRow from 'rax-multirow';
```

## Props

| name      | type       | default  | describe   |
| :--------- | :------- | :--- | :--------------------------- |
| renderCell | Function |      | render template function（need）                     |
| dataSource | List     |      | data for render（need） |
| cells      | Number   | 1    | each row contains several columns, default 1 columns
（need）  |

## Example

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
