# driver-weex

> Weex driver for Rax.

## Install

```bash
$ npm install --save driver-weex
```

## Use

```jsx
import {createElement, Component, render} from 'rax';
import * as WeexDriver from 'driver-weex';

class Example extends Component {
  render() {
    return (
      <div>
        <img width="560" height="560" src="https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg" />
      </div>
    );
  }
}

render(<Example />, null, {
  driver: WeexDriver
});
```
