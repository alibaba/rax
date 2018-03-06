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
      // Target format: `bundle`, `cmd`, `umd` or `factory`(build for builtin module format), default is umd
      target: 'umd',
      // Only for `bundle` target, default is '// {"framework" : "Rax"}'
      frameworkComment: '// {"framework" : "Rax"}',
      // component mode build config
      moduleName: 'rax',
      globalName: 'Rax',
      // Enable external builtin modules, default is false
      externalBuiltinModules: false,
      // Config which builtin modules should external, default config is define in `RaxPlugin.BuiltinModules`
      builtinModules: RaxPlugin.BuiltinModules,
      // Enable include polyfill files
      includePolyfills: false,
      // Config which polyfill should include, defaut is empty
      polyfillModules: [],
      // Check duplicate dependencies, default is ['rax']
      duplicateCheck: ['rax'],
    })
  ]
}
```

### MultiplePlatform(<config:Object>[, options: Object])

Output multiple platform

#### options

- `platforms` Array of ['web', 'node', 'weex', 'reactnative']
- `exclude` Multiple platform loader exclude, default is `/(node_modules|bower_components)/`
- `name` Default is `['universal-env']`, you can reassign to other module name when needed

example

```javascript
const config = require('webpack.config.js');

const multipleConfig = RaxPlugin.MultiplePlatform(config, {
  platforms: ['web', 'weex']
});

const compiler = webpack(configs);

// ....
```
