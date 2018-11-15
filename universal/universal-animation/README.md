# universal-animation [![npm](https://img.shields.io/npm/v/universal-animation.svg)](https://www.npmjs.com/package/universal-animation)

> Achieve timing animation

## Install

```bash
$ npm install universal-animation --save
```

## Usage

```js
import animate from 'universal-animation';

animate({
      props: [{
        element: findDOMNode(this.refs.block2),
        property,
        easing,
        duration,
        start,
        end,
        delay
      }]
}, () => {
  console.log('timing end')
})

```

## APIS

### `animate(config, callback)`

- config: Required, Object
	- props: Required, Array, animation props
		- element: Required, HTMLElement, animation element
		- property: Required, String, animation property, see [bindingx properties support](https://alibaba.github.io/bindingx/guide/cn_api_attributes)
		- start: Optional, Number, start value
		- end: Required, Number, end value
		- duration: Optional, Number, animation duration
		- delay: Optional, Number, animation delay
		- easing: Optional, String, animation easing, see [bindingx easing support](https://alibaba.github.io/bindingx/guide/cn_api_interpolator)
- callback: Optional, Function, after animation end