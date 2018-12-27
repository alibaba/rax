/**
 * 对于 mp 类型的小程序
 * 合并所有页面文件到 app.js
 * 并增加执行的 wrapper
 */
const { readFileSync, existsSync } = require('fs');
const { join } = require('path');
const { ConcatSource } = require('webpack-sources');

const SCHEMA_VAR = '__SCHEMA_MOCK_DATA__';

const webRegisterWrapper = [
  '__register_pages__(function(require){',
  '})',
];
const globalPolyfills = [
  "var __global__ = typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : new Function('return this')();",
  "typeof polyfill === 'function' && polyfill(__global__);",
];

module.exports = class WebpackMiniProgramPlugin {
  constructor(opts) {
    if (opts && opts.isH5) {
      this.isH5 = true;
    }
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('compilation', (compilation) => {
      compilation.hooks.optimizeAssets.tap('MiniAppPlugin', () => {
        const args = Object.values(compilation.assets);

        // polyfill global context
        args.unshift(new ConcatSource(globalPolyfills.join('')));
        args.unshift(ConcatSource);

        const app = new (ConcatSource.bind.apply(ConcatSource, args))();

        // 删除原 assets
        Object.keys(compilation.assets).forEach((key) => {
          delete compilation.assets[key];
        });

        // 增加 app.js
        // wrapper for app.js
        compilation.assets['app.js'] = app;
        global.AppJSContent = app.source();

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

        compilation.assets['app.web.js'] = new ConcatSource(
          webRegisterWrapper[0],
          app,
          injectSchemaMockData ? injectSchemaMockData : '',
          webRegisterWrapper[1]
        );
      });
    });
  }
};
