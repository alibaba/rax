Rx
==
> A universal cross-container render engine.

Rx is a universal JavaScript library with a largely React-compatible API. If you use React, you already know how to use Rx.

## Example

```js
/* @jsx createElement */

import {createElement, Component, render} from 'universal-rx';
class Hello extends Component {
  render() {
    return <text style={styles.title} ref="hello">Hello {this.props.name}</text>;
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

* render to container node not clear existed children
* findDOMNode accept id which is string type
* PropTypes check not work in production
