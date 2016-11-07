# rx-webpack-plugin [![npm](https://img.shields.io/npm/v/rx-webpack-plugin.svg)](https://www.npmjs.com/package/rx-webpack-plugin) [![Dependency Status](https://david-dm.org/alibaba/rx.svg?path=packages/rx-webpack-plugin)](https://david-dm.org/alibaba/rx.svg?path=packages/rx-webpack-plugin) [![Known Vulnerabilities](https://snyk.io/test/npm/rx-webpack-plugin/badge.svg)](https://snyk.io/test/npm/rx-webpack-plugin)

> Webpack plugin for Rx framework.

## Install

```sh
$ npm install --save-dev rx-webpack-plugin
```

## Usage

```javascript
var RxPlugin = require('rx-webpack-plugin');

module.exports = {
  plugins: [
    new RxPlugin({
      // page mode build config
      frameworkComment: false,
      externalBuiltinModules: false,
      builtinModules: RxPlugin.BuiltinModules,
      includePolyfills: false,
      polyfillModules: RxPlugin.PolyfillModules,
      // component mode build config
      moduleName: 'universal-rx',
      globalName: 'Rx',
    })
  ]
}
```
