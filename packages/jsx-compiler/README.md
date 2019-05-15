# jsx-compiler

Transform JSX styled Rax Components into parts.

## example

input:

```jsx
import { Component } from 'rax';

export default class extends Component {

  render() {
    return (<view>hello world</view>);
  }
}
```

run
```js
import { compile, baseOptions } from 'jsx-compiler';

const output = compile(code, Object.assign({}, baseOptions, customOptions));
```

output:

```
{
  defaultState?: Object,
  defaultProps?: Object,
  templateNode: Node,
}
```
