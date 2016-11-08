Rx
====
> A universal cross-container render engine.

## Run test
```sh
npm install
npm test
```

## Run examples
```sh
npm start
open http://127.0.0.1:9999/examples/
```

## Usage

```js
/* @jsx createElement */

import {render, createElement, Component} from 'weex-rx';
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

TODO