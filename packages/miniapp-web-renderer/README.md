# miniapp-web-renderer

> Web renderer for miniapp.

## Install

```bash
$ npm install --save miniapp-web-renderer
```

## Usage

- `render(manifest:<object>, pageComponents:<object>)`

```js
import { render } from 'miniapp-web-renderer';

import home from './home/index.html';
import list from './list/index.html';
import manifest from './manifest.json';

render(manifest，{ home, list });
```
