# driver-universal

> Driver for Universal App.

Support both DOM(Web) and Weex, with normalized 750rpx support of screen width.
## Install

```bash
$ npm install --save driver-universal
```

## Use

```jsx
import { createElement, render } from 'rax';
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

## Compare
| driver | append unit to relevant styles | 'rpx' translate | Compatible with flex | Compatible with event |
| ------ | ------------------------------ | --------------- | -------------------- | --------------------- |
| driver-dom | Append 'px' | Translate to 'vw' | Do nothing | Do nothing  |
| driver-weex | Append 'px' that relative to the width of the screen. | Translate to 'px' that relative to the width of the screen. | Do nothing | Do nothing |
| driver-universal | Append 'rpx' | Do nothing | Support parsing array like display: ["-webkit-box", "-webkit-flex", "flex"] | Support input doubleclick |
