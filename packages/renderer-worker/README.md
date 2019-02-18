# renderer-worker

> Web renderer for worker.

## Install

```bash
$ npm install --save renderer-worker
```

## Usage

`render.js`
```js
import domRender from 'renderer-worker';
import spawnWorker from 'worker-loader?inline!./worker.js';

const worker = spawnWorker();
domRender({ worker });
```
