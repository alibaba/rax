import ConcatSource from 'webpack/lib/ConcatSource';
import ExternalModuleFactoryPlugin from 'webpack/lib/ExternalModuleFactoryPlugin';
import RxAmdMainTemplatePlugin from './RxAmdMainTemplatePlugin';

export default class RxWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      runMainModule: true,
      includePolyfills: false,
    }, options);
  }

  apply(compiler) {
    compiler.plugin('this-compilation', (compilation) => {
      compilation.apply(new RxAmdMainTemplatePlugin(this.options));
    });

    compiler.plugin('compile', (params) => {
      params.normalModuleFactory.apply(new ExternalModuleFactoryPlugin('amd', [
        (context, request, callback) => {
          // @weex-module/* ignored
          if (/^@weex\-module\//.test(request)) {
            return callback(null, request);
          }
          callback();
        }
      ]));
    });

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
