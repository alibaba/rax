# rax-miniapp-renderer

> Rax renderer for miniapp.

## Install

```bash
$ npm install --save rax-miniapp-renderer
```

## Usage

`render.js`
```js
import domRender from 'rax-miniapp-renderer';
import spawnWorker from 'worker-loader?inline!./worker.js';

const worker = spawnWorker();
domRender({ worker });
```
