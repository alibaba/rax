# driver-weex

> Weex driver for Rax.

## Install

```bash
$ npm install --save driver-weex
```

## Use

```jsx
import {createElement, Component, render} from 'rax';
import WeexDriver from 'driver-weex';
import {isWeex} from 'universal-env';

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
  driver: isWeex ? WeexDriver : null
});
```

## Support elements

### Block: p, div, section, header, footer, nav, aside, main

### img

- src
- width: recommend use style.width
- height: recommend use style.height
- placeholder: weex only
- resize: weex only

### a

- href

### video

- src
- controls
- autoplay: not sure
- play-status: weex only

### textarea

- placeholder
- disabled
- autofocus
- rows
- children: as value
