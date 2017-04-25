# Counter

[![npm](https://img.shields.io/npm/v/rax-counter.svg)](https://www.npmjs.com/package/rax-counter)

## Install

```bash
$ npm install rax-counter --save
```

## Import

```jsx
import Counter from 'rax-counter';
```

## Props

| name      | type       | default  | describe   |
| :------ | :------- | :--- | :--- |
| value | Boolean |      | default value |
| start | Number |      | start num |
| end | Number |      | end number |
| onComplete | Object |      | complete event |
| countStyle | Object |      | count style |
| incrementContent | Component |      | content in increment button |
| decrementContent | Component |      | content in decrement button |

## Example

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Counter from 'rax-counter';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
	      <Counter
	        value={1}
	        end={5}
	        start={0}
	        onComplete={(num) => {}} />
      </View>
    );
  }
}

render(<App />);
```