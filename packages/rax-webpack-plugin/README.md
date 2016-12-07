# rax-webpack-plugin [![npm](https://img.shields.io/npm/v/rax-webpack-plugin.svg)](https://www.npmjs.com/package/rax-webpack-plugin) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-webpack-plugin)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-webpack-plugin) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-webpack-plugin/badge.svg)](https://snyk.io/test/npm/rax-webpack-plugin)

> Webpack plugin for Rax framework.

## Install

```sh
$ npm install --save-dev rax-webpack-plugin
```

## Usage

```javascript
var RaxPlugin = require('rax-webpack-plugin');

module.exports = {
  plugins: [
    new RaxPlugin({
      target: 'bundle',
      // page mode build config
      frameworkComment: '// {"framework" : "Rax"}', // Default
      includePolyfills: false,
      polyfillModules: [],
      // component mode build config
      moduleName: 'rax',
      globalName: 'Rax',
      // Common build config
      externalBuiltinModules: false,
      builtinModules: RaxPlugin.BuiltinModules,
      // Multiple platforms
      platforms: [] // arrayOf ['Weex', 'Web', 'Node', 'ReactNative']
    })
  ]
}
```
