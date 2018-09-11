# driver-worker

> Worker driver for Rax.

## Install

```bash
$ npm install --save driver-worker
```

## Usage

`worker.js`
```js
import createDriver from 'driver-worker';
import { render } from 'rax';
import App from './App';

render(
  <App />
  null,
  {
    driver: createDriver({ postMessage, addEventListener })
  }
);
```

`index.js`
```js
import domRenderer from 'driver-worker/lib/dom-renderer';
import spawnWorker from 'worker-loader?inline!./worker.js';

const worker = spawnWorker();
const tagNamePrefix = 'a-'; // Only for custom-elements
domRenderer({ worker, tagNamePrefix });
```
