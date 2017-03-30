import {ConcatSource} from 'webpack-sources';
import {DefinePlugin} from 'webpack';
import ExternalModuleFactoryPlugin from 'webpack/lib/ExternalModuleFactoryPlugin';
import RaxMainTemplatePlugin from './RaxMainTemplatePlugin';
import BuiltinModules from './BuiltinModules';
import MultiplePlatform from './MultiplePlatform';

const isProducation = process.env.NODE_ENV === 'production';

class RaxWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      builtinModules: BuiltinModules,
      externalBuiltinModules: false,
      frameworkComment: null,
      includePolyfills: false,
      platforms: [], // web node weex reactnative
      polyfillModules: [],
      runModule: false,
      bundle: 'compatible', // private
      target: 'umd'
    }, options);
  }

  apply(compiler) {
    compiler.apply(new DefinePlugin({
      '__DEV__': isProducation ? false : true
    }));

    compiler.plugin('this-compilation', (compilation) => {
      compilation.apply(new RaxMainTemplatePlugin(this.options));
    });

    compiler.plugin('compile', (params) => {
      params.normalModuleFactory.apply(new ExternalModuleFactoryPlugin('amd',
        (context, request, callback) => {
          // @weex-module/* ignored
          if (/^@weex\-module\//.test(request)) {
            return callback(null, request, 'commonjs');
          }

          let builtinModuleName = this.options.builtinModules[request];
          if (this.options.externalBuiltinModules && builtinModuleName) {
            if (Array.isArray(builtinModuleName)) {
              let customRequest = '(function(){ var mod;';

              builtinModuleName.forEach((name) => {
                customRequest += `if (!mod) { try { mod = require("${name}") } catch(e) {} }`;
              });

              customRequest += 'return mod;})()';
              // Custom external format
              return callback(null, customRequest, 'custom-format');
            } else {
              return callback(null, builtinModuleName, 'commonjs');
            }
          }

          callback();
        }
      ));
    });

    if (this.options.target === 'bundle' || this.options.frameworkComment) {
      var defaultFrameworkComment = '// {"framework" : "Rax"}';
      var frameworkComment = typeof this.options.frameworkComment === 'string' ?
        this.options.frameworkComment : defaultFrameworkComment;

      compiler.plugin('compilation', (compilation) => {
        // uglify-webpack-plugin will remove javascript's comments in
        // optimize-chunk-assets, add frameworkComment after that.
        compilation.plugin('after-optimize-chunk-assets', function(chunks) {
          chunks.forEach(function(chunk) {
            // In webpack2 chunk.initial was removed. Use isInitial()
            try {
              if (!chunk.initial) return;
            } catch (e) {
              if (!chunk.isInitial()) return;
            }

            chunk.files.forEach(function(file) {
              compilation.assets[file] = new ConcatSource(frameworkComment, '\n', compilation.assets[file]);
            });
          });
        });
      });
    }
  }
}

RaxWebpackPlugin.BuiltinModules = BuiltinModules;
RaxWebpackPlugin.MultiplePlatform = MultiplePlatform;

module.exports = RaxWebpackPlugin;
