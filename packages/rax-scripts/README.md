# rax-scripts [![npm](https://img.shields.io/npm/v/rax-scripts.svg)](https://www.npmjs.com/package/rax-scripts) [![Dependency Status](https://david-dm.org/alibaba/rax.svg?path=packages/rax-scripts)](https://david-dm.org/alibaba/rax.svg?path=packages/rax-scripts) [![Known Vulnerabilities](https://snyk.io/test/npm/rax-scripts/badge.svg)](https://snyk.io/test/npm/rax-scripts)

Project scripts for Rax.

## Commands

- `start` Start development services, Default enable hot reload and inline-module-source-map.
- `build` Bundle the project.

### Customize Webpack Config

**rax-scripts** has its own default webpack configuration. Also you can modify the webpack configuration.

#### 1. create `webpack.config.rewire.js` into project root.

```
rax-project
├── src
│   ├── App.css
│   ├── App.js
│   └── index.js
└── webpack.config.rewire.js
```

#### 2. `webpack.config.rewire.js` accept a webpackConfig and return it.

like:

```js
// webpack.config.rewire.js
const sassLoader = require.resolve('sass-loder');

module.exports = function (webpackConfig) {
  webpackConfig.module.loaders.push({
    test: /\.scss$/,
    loader: sassLoader,
  });

  return webpackConfig;
};
```
