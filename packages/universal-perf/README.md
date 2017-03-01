# universal-perf [![npm](https://img.shields.io/npm/v/universal-perf.svg)](https://www.npmjs.com/package/universal-perf)

## Install

```bash
npm install --save universal-perf
```

## Usage

```js
import {createElement, Component, render} from 'rax';
import {Text} from 'rax-components';
import {perf, monitor} from 'universal-perf';

class PerfTest extends Component {
  render() {
    return <Text style={styles.title}>Hello {this.props.name}</Text>;
  }
}

const styles = {
  title: {
    color: '#ff4400',
    fontSize: 48,
    fontWeight: 'bold',
  }
};

perf.start();
render(<PerfTest name="world" />, null, {
  monitor
});

perf.stop();
let measurements = perf.getLastMeasurements();

perf.printInclusive(measurements);
perf.printExclusive(measurements);
```

## API

### `perf.printExclusive`

Prints the render time.

### `perf.printInclusive`

Prints the overall time taken.

### `perf.printWasted`

Print newly inserted dom nodes in list as a waste of time

### `perf.printOperations`

Prints operations, eg. "remove attributes" and "change style"
