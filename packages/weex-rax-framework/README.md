# weex-rax-framework

## Global API Rax Framework provide

* `window`
  * devicePixelRatio
  * open()
  * postMessage()
  * addEventListener()
  * removeEventListener()
* `navigator`
  * platform
  * product
  * appName
  * appVersion
* `screen`
  * width
  * height
  * availWidth
  * availHeight
  * colorDepth
  * pixelDepth
* `location`
  * hash
  * search
  * pathname
  * port
  * hostname
  * host
  * protocol
  * origin
  * href
* [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/fetch)
* [`URL`](https://developer.mozilla.org/en-US/docs/Web/API/URL)
  * href
  * origin
  * searchParams
  * toString()
* [`URLSearchParams`](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)
  * append()
  * delete()
  * entries()
  * get()
  * getAll()
  * has()
  * keys()
  * set()
  * values()
  * toString()
* `alert`
* `define`
* `require`
* `__weex_downgrade__`
* `__weex_data__`
* `__weex_options__`
* `__weex_define__`
* `__weex_require__`

## How to custom builtin modules?

### 1. Build module use factory mode

```js
const webpack = require('webpack');
const RaxPlugin = require('rax-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    // Entry name should ends with `.factory`
    'your-module.factory' : './src/index.js',
  },
  output: {
    path: './dist/',
    filename: '[name].js',
  },
  plugins: [
    new RaxPlugin({
      // Your could config builtinModules here
      externalBuiltinModules: false,
      builtinModules: RaxPlugin.BuiltinModules,
    });
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015', 'rax']
      }
    }]
  }
}
```

Then publish module with factory build file to npm registry:
```sh
npm publish
```

Or [`link`](https://docs.npmjs.com/cli/link) module in local:
```sh
npm link
```

### 2. Config `builtin.js` in framework source

Install builtin module from npm:
```sh
npm install your-module --save
```

Or link from local:
```sh
npm link your-module
```

Config `builtin.js` and add your custom builtin module:
```js
export let BuiltinModulesFactory = {
  'rax': require('rax/dist/rax.factory'),
  // Add your builtin module
  'your-module': require('your-module/dist/your-module.factory'),
};
```

### 3. Build framework use framework mode

```js
const webpack = require('webpack');
const RaxPlugin = require('rax-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    // Entry name should ends with `.framework`
    'rax.framework': './packages/weex-rax-framework/src/index.js',
  },
  output: {
    path: './packages/weex-rax-framework/dist/',
    filename: '[name].js',
  },
  plugins: [
    new RaxPlugin();
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015']
      }
    }]
  }
}
```

## How to build weex `jsfm` including `weex-rax-framework`?

### 1. Clone the weex repository and install prerequisites

```sh
git clone git@github.com:alibaba/weex.git
cd weex
npm install
```

### 2. Install or link `weex-rax-framework`

```sh
npm install weex-rax-framework
```
Or

```sh
npm link weex-rax-framework
```

### 3. Config `weex-rax-framework`

Update `html5/frameworks/index.js` file with below content:

```js
import * as Weex from './legacy/index'
import Rax from 'weex-rax-framework'

export default {
  Rax,
  Weex
}
```

### 4. Build `jsfm` for native renderer to `dist/native.js`

```sh
npm run build:native
```

### 5. Copy `dist/native.js` to `weex-sdk`

```sh
cp -vf ./dist/native.js ./android/sdk/assets/main.js
cp -vf ./dist/native.js ./ios/sdk/WeexSDK/Resources/main.js
```
