/**
 * 对于 mp 类型的小程序
 * 合并所有页面文件到 app.js
 * 并增加执行的 wrapper
 */
const { ConcatSource } = require('webpack-sources');

module.exports = class WebpackMiniProgramPlugin {
  constructor(opts) {
    if (opts && opts.isH5) {
      this.isH5 = true;
    }
  }
  apply(compiler) {
    compiler.hooks.compilation.tap('compilation', compilation => {
      compilation.hooks.optimizeAssets.tap('MiniAppPlugin', () => {
        const args = Object.values(compilation.assets);

        // polyfill global context
        args.unshift(new ConcatSource(
          [
            'var __global__ = typeof global !== \'undefined\' ? global : typeof self !== \'undefined\' ? self : new Function(\'return this\')();',
            'typeof polyfill === \'function\' && polyfill(__global__);'
          ].join('')
        ));
        args.unshift(ConcatSource);

        const app = new (ConcatSource.bind.apply(ConcatSource, args))();

        // 删除原 assets
        Object.keys(compilation.assets).forEach(key => {
          delete compilation.assets[key];
        });

        // 增加 app.js
        // wrapper for app.js
        compilation.assets['app.js'] = new ConcatSource(
          this.isH5 ? 'self.$REG_PAGE(function(require){' : '',
          app,
          this.isH5 ? '})' : '',
        );

        if (this.isH5) {
          compilation.assets['app.raw.js'] = app;
        }
      });
    });
  }
};