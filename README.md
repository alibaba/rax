Rx
==
> :rocket: A universal cross-container render engine.

Rx is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rx.

## Example

```js
/* @jsx createElement */

import {createElement, Component, render} from 'universal-rx';

class Hello extends Component {
  render() {
    return <text style={styles.title}>Hello {this.props.name}</text>;
  }
}

const styles = {
  title: {
    color: '#ff4400',
    fontSize: 48,
    fontWeight: 'bold',
  }
};

render(<Hello name="world" />);
```

## Top-level API

* createElement
* cloneElement
* createFactory
* render
* Component
* PureComponent
* PropTypes
* findDOMNode
* unmountComponentAtNode
* findComponentInstance
* setNativeProps

## Difference with React

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
import {createElement, Component} from 'universal-rx';

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
import {createElement, render, findDOMNode} from 'universal-rx';

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
