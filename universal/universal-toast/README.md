# universal-toast [![npm](https://img.shields.io/npm/v/universal-toast.svg)](https://www.npmjs.com/package/universal-toast)

> An universal toast

## Install

```bash
$ npm install universal-toast --save
```

## Usage

```js
import Toast from 'universal-toast';

Toast.show('Hi');
```

## APIS

### `Toast.show(message, duration)`

- message: Required, String, the text to toast
- duration: Optional, Number, unit ms, the duration of the toast. May be Toast.SHORT(2500ms) or Toast.LONG(3500ms)