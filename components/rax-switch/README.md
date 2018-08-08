# rax-switch [![npm](https://img.shields.io/npm/v/rax-switch.svg)](https://www.npmjs.com/package/rax-switch)
> Renders a boolean input.

## Install

```bash
$ npm install rax-switch --save
```

## Import

```jsx
import Switch from 'rax-switch';
```

## Example
```js
import {createElement, Component, render} from 'rax';
import View from 'rax-view';
import Text from 'rax-text';
import Switch from '../../../packages/rax-switch';

class App extends Component {
  state = {
    toggle: true,
  }
  render() {
    return (
      <View>
        <Switch 
          value={this.state.open}
          onValueChange={(value) => {
            this.setState({toggle: value});
          }}
        />
        <Text>{String(this.state.toggle)}</Text>
      </View>
    );
  }
}

render(<App />);
```