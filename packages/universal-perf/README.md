# universal-perf [![npm](https://img.shields.io/npm/v/universal-perf.svg)](https://www.npmjs.com/package/universal-perf)

## Install

```bash
npm install --save universal-perf
```

## Usage

```js
import { View } from 'rax-components';
import { Perf } from 'universal-perf';

function measure(fn) {
  Perf.start();
  fn();
  Perf.stop();

  return Perf.getLastMeasurements();
}

let measurements = measure(() => {
  render(<View />);
});

Perf.printInclusive(measurements);
Perf.printExclusive(measurements)
```
