const { ConcatSource } = require('webpack-sources');
const assert = require('assert');

/**
 * 对文件进行上下包裹, 实现类似 node.js 中 cjs 模块包裹
 * ['(function(require, module, exports){', '})();'] 的功能
 */
module.exports = class WebpackWrapPlugin {
  /**
   * WraperPlugin
   * @param  {Object} options 选项
   * @param {string|function} options.header 前内容
   * @param {string|function} options.footer 后内容
   * @constructor
   */
  constructor(options) {
    assert.ok(
      Object.prototype.toString.call(options) === '[object Object]',
      'Argument "args" must be an object.',
    );

    this.header = options.hasOwnProperty('header') ? options.header : '';
    this.footer = options.hasOwnProperty('footer') ? options.footer : '';
  }

  apply(compiler) {
    const header = this.header;
    const footer = this.footer;
    const entry = compiler.options.entry;

    const wrapFile = (compilation, fileName) => {
      // preparedChunks 在 apply SingleEntryPlugin 后会向 preparedChunks push
      // 对应的当前模块, 根据模块的 name 也就是 entryName
      // 主要 webpack 源码 Compilation.prototype.addEntry
      // @see https://github.com/webpack/webpack/blob/v1.14.0/lib/Compilation.js#L440

      const headerContent =
        typeof header === 'function'
          ? header(fileName, entry, compilation.preparedChunks)
          : header;
      const footerContent =
        typeof footer === 'function'
          ? footer(fileName, entry, compilation.preparedChunks)
          : footer;

      compilation.assets[fileName] = new ConcatSource(
        String(headerContent),
        compilation.assets[fileName],
        String(footerContent),
      );
    };

    const wrapChunks = (compilation, chunks) => {
      chunks.forEach((chunk) => {
        chunk.files.forEach((fileName) => {
          wrapFile(compilation, fileName);
        });
      });
    };

    compiler.hooks.compilation.tap('WrapperPlugin', (compilation) => {
      compilation.hooks.optimizeChunkAssets.tapAsync(
        'WrapperPlugin',
        (chunks, done) => {
          wrapChunks(compilation, chunks, footer, header);
          done();
        },
      );
    });
  }
};
