# driver-dom

> DOM driver for Rax.

## Install

```bash
$ npm install --save driver-dom
```

## Use

```jsx
import {createElement, render} from 'rax';
import DomDriver from 'driver-dom';

function Example() {
  return (
    <div>
      <img width="560" height="560" src="https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg" />
    </div>
  );
}

render(<Example />, null, {
  driver: DomDriver
});
```

## API

**static setTagNamePrefix(prefix: String)**

Set tag prefix for custom elements.

```js
import DomDriver from 'driver-dom';

DomDriver.setTagNamePrefix('a-');
```




