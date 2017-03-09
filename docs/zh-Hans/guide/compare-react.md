# Rax 与 React

* 没有 `createClass()` 方法，使用 ES6 的方式实现。
```js
// Before
import React from 'react';

const Hi = React.createClass({
  render() {
    return (
      <text>hi</text>
    );
  }
});

export default Hi;
```

```js
// After
import { createElement, Component } from 'rax';

class Hi extends Component {
  render() {
    return (
      <text>hi</text>
    );
  }
}

export default Hi;
```

* 渲染到新的容器节点时不清除已存在的节点.
* Rax `setState()` 是同步的, React `setState` 是异步的.
* `findDOMNode()` 方法可以接收字符串类型的 id.
```jsx
import {createElement, render, findDOMNode} from 'rax';

class Hi extends Component {
  render() {
    return (
      <text id="hi">hi</text>
    );
  }
}

render(<Hi />, document.body);
const node = findDOMNode('hi');
```
* `PropTypes` 只是 React 的接口兼容，并没有实际工作
