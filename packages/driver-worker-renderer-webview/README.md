# driver-worker-renderer-webview

> Worker driver renderer for webview.

## Install

```bash
$ npm install --save driver-worker-renderer-webview
```

## Usage

`render.js`
```js
import domRender from 'driver-worker-renderer-webview';
import spawnWorker from 'worker-loader?inline!./worker.js';

const worker = spawnWorker();
domRender({ worker });
```
