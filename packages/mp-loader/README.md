# mp-loader

> A webpack loader that transform mini program DSL stynax project to Rax.

## Install

```bash
$ npm install --save mp-loader
```

## Usage

`index.js`
```js
import 'mp-loader!./app.js';
```

## Options

- type: Type of miniapp stynax
  - ali: [Default] Alibaba type of mini program stynax.
  - wx: Weixin type of mini program stynax.
