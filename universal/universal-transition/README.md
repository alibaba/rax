# universal-transition [![npm](https://img.shields.io/npm/v/universal-transition.svg)](https://www.npmjs.com/package/universal-transition)

> Achieve transition animation

## Install

```bash
$ npm install universal-transition --save
```

## Usage

```js
import transition from 'universal-transition';

transition(document.querySelector('#box'), {
  transform: 'translate(10px, 20px) scale(1.5, 1.5) rotate(90deg)',
  opacity: '0.5'
}, {
  timingFunction: 'ease',
  delay: 0,
  duration: 1000
}, function() {
  console.log('animation end');
});
```

## APIS

### `transition(domNode, styles, options, callback)`

- domNode: Required, DOMNode
- styles: Required, Object, transition styles
- options: Optional, Object, options attributes:
  - timingFunction: default ease,
  - delay: default 0,
  - duration: default 0,
- callback: Optional, Function, after animation end