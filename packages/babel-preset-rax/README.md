# babel-preset-rax [![npm](https://img.shields.io/npm/v/babel-preset-rax.svg)](https://www.npmjs.com/package/babel-preset-rax) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/babel-preset-rax)](https://david-dm.org/alibaba/rax.svg?path=packages/babel-preset-rax) [![Known Vulnerabilities](https://snyk.io/test/npm/babel-preset-rax/badge.svg)](https://snyk.io/test/npm/babel-preset-rax)

> Babel preset for all Rax plugins.

## Install

```sh
$ npm install --save-dev babel-preset-rax
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "presets": ["rax"]
}
```

### Via CLI

```sh
$ babel script.js --presets rax
```

### Via Node API

```javascript
require('babel-core').transform('code', {
  presets: ['rax']
});
```
