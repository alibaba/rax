# driver-dom

> DOM driver for Rax.

## Install

```bash
$ npm install --save driver-dom
```

## Use

```jsx
import {createElement, render} from 'rax';
import DriverDOM from 'driver-dom';
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
  driver: DriverDOM
});
```

## API

**static setTagNamePrefix(prefix: String)**

Set tag prefix for custom elements.

```js
import DriverDOM from 'driver-dom';

DriverDOM.setTagNamePrefix('a-');
```




