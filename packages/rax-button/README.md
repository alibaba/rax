# Button

[![npm](https://img.shields.io/npm/v/rax-button.svg)](https://www.npmjs.com/package/rax-button)

Button is the basic button component. Internal implementation relies on `<Touchable>` to support onPress defined click events.
Button with default styles, but also support the style of custom.


## Install

```bash
$ npm install rax-button --save
```

## Import

```jsx
import Button from 'rax-button';
```

## Props

| name      | type       | default  | describe   |
| :------ | :------- | :--- | :--- |
| onPress | Function |      | click events |

At the same time to support any custom attributes through

## Example

```jsx
// demo
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Button from 'rax-button';

class App extends Component {
  render() {
    return (
      <View style={{ width: 750 }}>
        <Button onPress={(evt) => { alert('你好'); }}>点我</Button>
      </View>
    );
  }
}

render(<App />);
```