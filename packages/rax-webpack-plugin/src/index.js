import ConcatSource from 'webpack/lib/ConcatSource';
import ExternalModuleFactoryPlugin from 'webpack/lib/ExternalModuleFactoryPlugin';
import CustomUmdMainTemplatePlugin from './CustomUmdMainTemplatePlugin';
import path from 'path';
import BuiltinModules from './BuiltinModules';

const platformRegexp = (platforms) => {
  return new RegExp('((' + platforms.join(')|(') + '))', 'i');
};

const envLoader = require.resolve('./env-loader.js');
let envLoaderDefine;

let babelLoaderFileTypeSetMap = {};

const platformWihteList = ['Web', 'Node', 'Weex', 'ReactNative'];

class RaxWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      builtinModules: BuiltinModules,
      externalBuiltinModules: false,
      frameworkComment: null,
      includePolyfills: false,
      platforms: [], // Web Node Weex ReactNative
      polyfillModules: [],
      runMainModule: false,
      target: null
    }, options);
  }

  apply(compiler) {
    const self = this;

    compiler.plugin('this-compilation', (compilation) => {
      babelLoaderFileTypeSetMap = {};

      // filter platforms by platformWihteList
      this.options.platforms = this.options.platforms.filter(platform => {
        if (platformWihteList.indexOf(platform) !== -1) {
          return true;
        }
        return false;
      });

      compilation.apply(new CustomUmdMainTemplatePlugin(this.options));
    });

    compiler.plugin('entry-option', (context, entry) => {
      const entries = Object.keys(entry);

      if (this.options.platforms.length) {
        // append platform entry
        entries.forEach(name => {
          this.options.platforms.forEach(p => {
            entry[name + '.' + p.toLowerCase()] = entry[name];
          });
        });

        this.platformMatchRegexp = platformRegexp(this.options.platforms);
      }
    });

    compiler.plugin('normal-module-factory', (normalModuleFactory) => {
      const platforms = this.options.platforms;

      let platformsEntry = {};

      normalModuleFactory.plugin('before-resolve', (data, callback) => {
        const entries = compiler.options.entry;

        Object.keys(entries).forEach((entry) => {
          if (entries[entry] === data.request) {
            if (platformsEntry[data.request]) {
              platformsEntry[data.request].push(entry);
            } else {
              platformsEntry[data.request] = [entry];
            }
          }
        });

        data.entryName =
          callback(null, data);
      });

      normalModuleFactory.plugin('after-resolve', (data, callback) => {
        // Not set platforms
        if (platforms && platforms.length === 0) {
          return callback(null, data);
        }

        const entries = compiler.options.entry;

        for (const entry in entries) {
          if (babelLoaderFileTypeSetMap[entry]) {
            continue;
          }

          let platformType = this.platformMatchRegexp.exec(entry);

          const entryRawRequest = entries[entry];
          // entryRawRequest == data.rawRequest
          if (entryRawRequest === data.rawRequest) {
            platformType = platformType && platformType[1] || 'Bundle';

            babelLoaderFileTypeSetMap[entry] = true;

            let request = data.request;
            request = request.split('!');

            let requestLoaders = request.slice(0, request.length - 1);
            let requestResource = request.slice(request.length - 1, request.length);

            envLoaderDefine = envLoader + '?is' + platformType.substr(0, 1).toUpperCase() + platformType.substr(1) +
              '=true';

            requestResource.unshift(envLoaderDefine);

            data.request = requestLoaders.concat(requestResource).join('!');
            data.loaders.push(envLoaderDefine);

            break;
          }
        };

        callback(null, data);
      });
    });


    compiler.parser.plugin('call require', function(expr) {
      const platforms = self.options.platforms;
      if (platforms && platforms.length === 0) return;

      if (expr.arguments.length !== 1) return;

      let param = this.evaluateExpression(expr.arguments[0]);

      if (param.isString()) {
        let parentModule = this.state.module; // this.state.current;
        let requireRequest = param.string;

        // @see https://webpack.github.io/docs/loaders.html#loader-order
        if (!requireRequest ||
          /\.(?!\b(jsx|js)\b)[a-z0-9]+/.test(requireRequest) || // exclude '' '.js' '.jsx'
          /^!!/.test(requireRequest) ||
          /^-!/.test(requireRequest) ||
          /^react\-/.test(requireRequest) ||
          /^@weex\-module\//.test(requireRequest) // @weex-module/* ignored
        ) {
          return true;
        } else if (/\.jsx?$/.test(this.state.module.resource)) {
          // inherit parent module loaders
          expr.arguments[0].value = '!!' +
            parentModule.loaders.join('!') + '!' + expr.arguments[0].value;
        }
      }
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
        compilation.plugin('optimize-chunk-assets', function(chunks, callback) {
          chunks.forEach(function(chunk) {
            if (!chunk.initial) return;
            chunk.files.forEach(function(file) {
              compilation.assets[file] = new ConcatSource(frameworkComment, '\n', compilation.assets[file]);
            });
          });
          callback();
        });
      });
    }
  }
}

RaxWebpackPlugin.BuiltinModules = BuiltinModules;

module.exports = RaxWebpackPlugin;
