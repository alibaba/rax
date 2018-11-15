# universal-jsonp [![npm](https://img.shields.io/npm/v/universal-jsonp.svg)](https://www.npmjs.com/package/universal-jsonp)

> jsonp like standard Fetch API

## Install

```bash
$ npm install universal-jsonp --save
```

## Usage

```js
import jsonp from 'universal-jsonp';

jsonp('/users.jsonp')
  .then(function(response) {
    return response.json()
  }).then(function(json) {
    console.log('parsed json', json)
  }).catch(function(err) {
    console.log('parsing failed', err)
  });
```

## APIS

### `jsonp(url, options)`

- url: Required, String, jsonp url
- options: Optional, Object, options attributes:
  - timeout: Number, default 5000ms
  - jsonpCallback: String, default `callback`
  - jsonpCallbackFunctionName: String, default randomly generated

