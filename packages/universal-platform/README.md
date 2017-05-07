# universal-platform [![npm](https://img.shields.io/npm/v/universal-platform.svg)](https://www.npmjs.com/package/universal-platform)

> Get runtime OS name

## Install

```bash
$ npm install universal-platform --save
```

## Usage

```js
import {OS} from 'universal-platform';

// maybe iOS, Android, or Web
console.log(OS);
```

## APIS

### `select(obj)`

Use it to return platform specific component, like below:

```js
import {select} from 'universal-platform';

import AndroidComponent from './AndroidComponent';
import IOSComponent from './IOSComponent';

const DestComponent = select({
  iOS: IOSComponent,
  Android: AndroidComponent
});
```