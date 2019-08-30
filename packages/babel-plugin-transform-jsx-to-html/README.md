# babel-plugin-transform-jsx-to-html
> Transform jsx to html string for better ssr performance.

## Installation

```sh
npm install --save-dev babel-plugin-transform-jsx-to-html
```

## Usage

### Via `.babelrc`

**.babelrc**

```json
{
  "plugins": [
    "babel-plugin-transform-jsx-to-html",
    "babel/plugin-transform-react-jsx"
  ]
}
```

## Example

### basic example

Your `component.js` that contains this code:

```js
import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return <div className="header" />
  }
}
```

Will be transpiled like this:

```js
import { createElement, Component } from 'rax';

class App extends Component {
  render() {
    return [{
      __html: '<div class="header" />'
    }];
  }
}
```

These pre transpiled html can be used in server renderer, like [rax-server-renderer](https://github.com/alibaba/rax/tree/master/packages/rax-server-renderer)

### more examples

input 

```jsx
<div>
  <View />
</div>
```

output

```js
[{
   __html: "<div>"
}, 
createElement(View, null),
{
  __html: "</div>"
}]
```

input 

```jsx
<div className="container" style={style} onClick={onClick}>
  <div>a {props.index}</div>
</div>
```

output

```js
[{
  __html: "<div class=\"container\""
}, {
  __attrs: {
    style: style,
    onClick: onClick
  }
}, {
  __html: "><div>a "
}, props.index, {
  __html: "</div></div>"
}]
```