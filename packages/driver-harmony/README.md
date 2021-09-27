# driver-harmony

> Harmony OS driver for Rax.

## Install

```bash
$ npm install --save driver-harmony
```

## Use

```jsx
import {createElement, render} from 'rax';
import DriverHarmony from 'driver-harmony';

function Example() {
  return (
    <div>
      <image width="560" height="560" src="https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg" />
    </div>
  );
}

render(<Example />, null, {
  driver: DriverHarmony
});
```
