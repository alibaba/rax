# Difference with React

* No `createClass()` method，use ES6 class by `extends Component` class instead of calling createClass.
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
import {createElement, Component} from 'rax';

class Hi extends Component {
  render() {
    return (
      <text>hi</text>
    );
  }
}

export default Hi;
```

* Render to new container node not clear existed children.
* The `setState()` actions are synchronous, and React `setState` actions are asynchronous.
* The `findDOMNode()` method could accept id which is a string type.
```js
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
* The `PropTypes` is only interface React-compatible not really working
