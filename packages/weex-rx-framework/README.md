# weex-rx-framework

## How to custom builtin modules?

### 1. Build module use factory mode

```js
const webpack = require('webpack');
const RxPlugin = require('rx-webpack-plugin');

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
    new RxPlugin({
      // Your could config builtinModules here
      externalBuiltinModules: false,
      builtinModules: RxPlugin.BuiltinModules,
    });
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'babel', // 'babel-loader' is also a legal name to reference
      query: {
        presets: ['es2015', 'rx']
      }
    }]
  }
}
```

Then publish module with factory build file to npm registry:
```sh
$ npm publish
```

Or [`link`](https://docs.npmjs.com/cli/link) module in local:
```sh
$ npm link
```

### 2. Config `builtin.js` in framework source

Install builtin module from npm:
```sh
$ npm install your-module --save
```

Or link from local:
```sh
$ npm link your-module
```

Config `builtin.js` and add your custom builtin module:
```js
export let BuiltinModulesFactory = {
  '@universal/rx': require('universal-rx/dist/rx.factory'),
  '@universal/env': require('universal-env/dist/env.factory'),
  '@universal/transition': require('universal-transition/dist/transition.factory'),
  // Add your builtin module
  'your-module': require('your-module/dist/your-module.factory'),
};
```

### 3. Build framework use framework mode

```js
const webpack = require('webpack');
const RxPlugin = require('rx-webpack-plugin');

module.exports = {
  target: 'node',
  entry: {
    // Entry name should ends with `.framework`
    'rx.framework': './packages/weex-rx-framework/src/index.js',
  },
  output: {
    path: './packages/weex-rx-framework/dist/',
    filename: '[name].js',
  },
  plugins: [
    new RxPlugin();
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
