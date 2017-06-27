# rax-scripts [![npm](https://img.shields.io/npm/v/rax-scripts.svg)](https://www.npmjs.com/package/rax-scripts) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-scripts)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-scripts) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-scripts/badge.svg)](https://snyk.io/test/npm/rax-scripts)

Rax project development tools.

## Commands 

- `start` Start development services, Default enable hot reload and inline-module-source-map.
- `build` Bundle the project.

### update webpack config

**rax-scripts** has its own default webpack configuration. Also you can modify the webpack configuration.

#### 1. create `webpack.config.update.js` into project root.

```
Rax-project
├── src
│   ├── App.css
│   ├── App.js
│   └── index.js
└── webpack.config.update.js
```

#### 2. `webpack.config.update.js` accept a webpackConfig and return it.

like:

```js
// webpack.config.update.js
const sassLoader = require.resolve('sass-loder');

module.exports = function update (webpackConfig) {
  
  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    loader: sassLoader
  });
  
  return webpackConfig;
}
```