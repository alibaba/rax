# perf-measurer

## Install

```bash
npm install --save perf-measurer
```

## Usage

```js
import {createElement, Component, render} from 'rax';
import Perf from 'perf-measurer';

class PerfTest extends Component {
  render() {
    return <h1 style={styles.title}>Hello {this.props.name}</h1>;
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
  measurer: Perf.Measurer
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
