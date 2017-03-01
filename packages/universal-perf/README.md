# universal-perf [![npm](https://img.shields.io/npm/v/universal-perf.svg)](https://www.npmjs.com/package/universal-perf)

## Install

```bash
npm install --save universal-perf
```

## Usage

```js
import {createElement, Component, render} from 'rax';
import {Text} from 'rax-components';
import {Perf, Monitor} from 'universal-perf';

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

Perf.start();
render(<PerfTest name="world" />, null, {
  Monitor
});

Perf.stop();
let measurements = Perf.getLastMeasurements();

Perf.printInclusive(measurements);
Perf.printExclusive(measurements);
```

## API

### `Perf.printExclusive`

Prints the render time.

### `Perf.printInclusive`

Prints the overall time taken.

### `Perf.printWasted`

Print newly inserted dom nodes in list as a waste of time

### `Perf.printOperations`

Prints operations, eg. "remove attributes" and "change style"
