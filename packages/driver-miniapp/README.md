# driver-miniapp

> MiniApp (runtime) driver for Rax, extended from driver-dom.

## Install

```bash
$ npm install --save driver-miniapp
```

## Use

```jsx
import {createElement, render} from 'rax';
import DriverMiniApp from 'driver-miniapp';
import View from 'rax-view';
import Image from 'rax-view';


function Example() {
  return (
    <View>
      <Image source={{
        uri: "https://img.alicdn.com/tps/TB1z.55OFXXXXcLXXXXXXXXXXXX-560-560.jpg"
      }} />
    </View>
  );
}

render(<Example />, null, {
  driver: DriverMiniApp
});
```
