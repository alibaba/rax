/* eslint-disable import/no-extraneous-dependencies */
/**
 * 对于 mp 类型的小程序
 * 合并所有页面文件到 app.js
 * 并增加执行的 wrapper
 */
const { ConcatSource } = require('webpack-sources');

const globalPolyfills = [
  "typeof polyfill === 'function' && polyfill(typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : new Function('return this')());",
];

module.exports = class WebpackMiniProgramPlugin {
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

        compilation.assets['app.js'] = app;
        compilation.assets['app.web.js'] = new ConcatSource(
          '__register_pages__(function(require){',
          app,
          '});',
        );
      });
    });
  }
};
