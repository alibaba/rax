# Difference with React

* No `createClass()` method，use ES6 class by `extends Component` class instead of calling createClass

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

* Render to new container node not clear existed children
* The `findDOMNode()` method accept id which is string type

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

* `PropTypes` not check in production
