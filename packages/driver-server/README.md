# driver-server

> Server driver for Rax.

## Install

```bash
$ npm install --save driver-server
```

## Use

```jsx
import {createElement, Component, render} from 'rax';
import ServerDriver from 'driver-server';
import {isNode} from 'universal-env';

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
  driver: isNode ? ServerDriver : null
});
```
