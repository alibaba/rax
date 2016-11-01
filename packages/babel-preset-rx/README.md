# babel-preset-react [![npm](https://img.shields.io/npm/v/babel-preset-rx.svg)](https://www.npmjs.com/package/babel-preset-rx) [![Dependency Status](https://david-dm.org/alibaba/rx.svg?path=packages/babel-preset-rx)](https://david-dm.org/alibaba/rx.svg?path=packages/babel-preset-rx) [![Known Vulnerabilities](https://snyk.io/test/npm/babel-preset-rx/badge.svg)](https://snyk.io/test/npm/babel-preset-rx) 

> Babel preset for all Rx plugins.

## Install

```sh
$ npm install --save-dev babel-preset-rx
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["rx"]
}
```

### Via CLI

```sh
$ babel script.js --presets rx
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  presets: ['rx']
});
```
