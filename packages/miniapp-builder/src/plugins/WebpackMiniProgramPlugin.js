/**
 * 1. Add global polyfill.
 * 2. Inject schema mock data in ide.
 */
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { ConcatSource } = require('webpack-sources');

/**
 * Polyfill AppRuntime global context.
 */
const POLYFILL_CODE = [
  '/* polyfill ES for global object */;',
  `(function(g, p) {
    p && p(g);
  })(
    typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : new Function('return this')(),
    typeof polyfill === 'function' ?  polyfill : null
  );`
];
const SCHEMA_VAR = '__SCHEMA_MOCK_DATA__';

module.exports = class WebpackMiniAppPlugin {

  /**
   * WebpackMiniAppPlugin
   * @param {Boolean} options.injectSchemaMock Try to inject schema mock data.
   */
  constructor(options = {}) {
    this.injectSchemaMock = options.injectSchemaMock;
  }

  /**
   * Inject schema data for ide mode.
   */
  _injectSchemaMock(compilation) {
    let injectSchemaMockData;
    const mockDataPath = join(compiler.context, 'schema/mock-data.json');
    if (existsSync(mockDataPath)) {
      try {
        const mockData = JSON.parse(readFileSync(mockDataPath));
        // Inject schema data
        injectSchemaMockData = `
          try {
            ${SCHEMA_VAR} = ${JSON.stringify(mockData)};
          } catch(err) {
            console.warn('Inject schema data with error', err);
          }
        `;
      } catch (err) {
        throw new Error('Please check schema/mock-data.json is a valid JSON string.');
      }
    }

    if (injectSchemaMockData) {
      compilation.assets['app.js'] = new ConcatSource(
        compilation.assets['app.js'],
        injectSchemaMockData
      );
    }
  }


  apply(compiler) {
    compiler.hooks.compilation.tap('compilation', (compilation) => {
      compilation.hooks.optimizeAssets.tap('MiniAppPlugin', () => {
        const args = Object.values(compilation.assets);

        // Polyfill global context
        args.unshift(new ConcatSource(POLYFILL_CODE.join('')));
        args.unshift(ConcatSource);

        const app = new (ConcatSource.bind.apply(ConcatSource, args))();

        // Delete original assets.
        Object.keys(compilation.assets).forEach((key) => {
          delete compilation.assets[key];
        });

        // Dist app.js
        compilation.assets['app.js'] = app;
        global.AppJSContent = app.source();

        if (this.injectSchemaMock) {
          this._injectSchemaMock(compilation);
        }
      });
    });
  }
};
