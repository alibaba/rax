# rax-duplicate-check-webpack-plugin [![npm](https://img.shields.io/npm/v/rax-duplicate-check-webpack-plugin.svg)](https://www.npmjs.com/package/rax-duplicate-check-webpack-plugin) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-duplicate-check-webpack-plugin)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-duplicate-check-webpack-plugin) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-duplicate-check-webpack-plugin/badge.svg)](https://snyk.io/test/npm/rax-duplicate-check-webpack-plugin)

> Webpack plugin for Rax duplicate dependencies check.

## Install

```sh
$ npm install --save-dev rax-duplicate-check-webpack-plugin
```

## Usage

```javascript
var RaxDuplicateCheckPlugin = require('rax-duplicate-check-webpack-plugin');

module.exports = {
  plugins: [
    new RaxDuplicateCheckPlugin()
  ]
}
```

## Output

example

```javascript
duplicate-package-found:
  <universal-env>
    0.2.9 ./~/universal-env
    0.2.8 ./~/rax-text/~/universal-env
```
