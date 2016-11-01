import ConcatSource from 'webpack/lib/ConcatSource';
import ExternalModuleFactoryPlugin from 'webpack/lib/ExternalModuleFactoryPlugin';
import CustomUmdMainTemplatePlugin from './CustomUmdMainTemplatePlugin';
import path from 'path';

module.exports = class RxWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      runMainModule: false,
      includePolyfills: false,
      frameworkComment: false,
    }, options);
  }

  apply(compiler) {
    compiler.plugin('this-compilation', (compilation) => {
      compilation.apply(new CustomUmdMainTemplatePlugin(this.options));
    });

    compiler.plugin('compile', (params) => {
      params.normalModuleFactory.apply(new ExternalModuleFactoryPlugin('amd',
        (context, request, callback) => {
          // @weex-module/* ignored
          if (/^@weex\-module\//.test(request)) {
            return callback(null, request, 'commonjs');
          }
          callback();
        }
      ));
    });

    if (this.options.frameworkComment) {

      compiler.plugin('compilation', (compilation) => {
        compilation.plugin('optimize-chunk-assets', function(chunks, callback) {
          chunks.forEach(function(chunk) {
            if(!chunk.initial) return;
            chunk.files.forEach(function(file) {
              compilation.assets[file] = new ConcatSource('// {"framework" : "Rx"}', '\n', compilation.assets[file]);
            });
          });
          callback();
        });
      });
    }

  }
}
