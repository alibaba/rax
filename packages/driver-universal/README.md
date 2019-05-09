# driver-universal

> Driver for Universal App.

## Install

```bash
$ npm install --save driver-universal
```

## Use

```jsx
import {createElement, render} from 'rax';
import View from 'rax-view';
import Image from 'rax-image';
import DriverUniversal from 'driver-universal';

function Example() {
  return (
    <View>
      <Image width="560" height="560" src="https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg" />
    </View>
  );
}

render(<Example />, null, {
  driver: DriverUniversal
});
```
