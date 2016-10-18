# rx-webpack-plugin

> Webpack plugin for Rx framework.

## Install

```sh
$ npm install --save-dev rx-webpack-plugin
```

## Usage

``` javascript
var RxWebpackPlugin = require('rx-webpack-plugin');

module.exports = {
  plugins: [
    new RxWebpackPlugin({
      runMainModule: true,
      includePolyfills: false,  
    })
  ]
}
```
