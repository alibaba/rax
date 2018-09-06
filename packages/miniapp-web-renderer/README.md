# miniapp-web-renderer

---

> A renderer for miniapp

## Install

```bash
$ npm install --save miniapp-web-renderer
```

## Usage

- `renderer(manifest:<object>, pageComponents:<object>)`

```js
import { render } from 'miniapp-web-renderer';

const manifest = require('./manifest.json');

render(manifest, {
  home: require('./home/index.html'),
  list: require('./home/list.html'),
});
```
