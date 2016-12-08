import ConcatSource from 'webpack/lib/ConcatSource';
import ExternalModuleFactoryPlugin from 'webpack/lib/ExternalModuleFactoryPlugin';
import CustomUmdMainTemplatePlugin from './CustomUmdMainTemplatePlugin';
import BuiltinModules from './BuiltinModules';
import qs from 'qs';

const getRequireQuery = (request) => {
  let markIndex = request.indexOf('?');
  if (markIndex !== -1) {
    let query = qs.parse(request.substr(markIndex + 1));
    query.originRequest = request.substr(0, markIndex);
    return query;
  }
  return null;
};

const platformLoader = require.resolve('./PlatformLoader');

const platformWihteList = ['web', 'node', 'weex', 'reactnative'];

class RaxWebpackPlugin {
  constructor(options) {
    this.options = Object.assign({
      builtinModules: BuiltinModules,
      externalBuiltinModules: false,
      frameworkComment: null,
      includePolyfills: false,
      platforms: [], // web node weex reactnative
      polyfillModules: [],
      runMainModule: false,
      target: null
    }, options);
  }

  apply(compiler) {
    // filter platforms by platformWihteList
    this.options.platforms = this.options.platforms.filter(platform => {
      let p = platform.toLowerCase();
      if (platformWihteList.indexOf(p) !== -1) {
        return true;
      }
      return false;
    });

    compiler.plugin('this-compilation', (compilation) => {
      compilation.apply(new CustomUmdMainTemplatePlugin(this.options));
    });

    if (this.options.platforms && this.options.platforms.length !== 0) {
      const platforms = this.options.platforms;

      compiler.plugin('entry-option', (context, entry) => {
        if (Array.isArray(entry) || typeof entry === 'string') {
          // TODO: support entry pass array/string ?
        } else if (typeof entry === 'object') {
          const entries = Object.keys(entry);
          // append platform entry
          entries.forEach(name => {
            platforms.forEach(p => {
              const platformType = p.toLowerCase();

              if (Array.isArray(entry[name])) {
                entry[`${name}.${platformType}`] = entry[name].map(ev => {
                  return `${ev}?platform=${platformType}`;
                });
              } else if (typeof entry[name] === 'string') {
                entry[`${name}.${platformType}`] = `${entry[name]}?platform=${platformType}`;
              }
            });
          });
        }

      });

      compiler.plugin('normal-module-factory', (normalModuleFactory) => {
        normalModuleFactory.plugin('after-resolve', (data, callback) => {
          const requireQuery = getRequireQuery(data.rawRequest);
          // has platform specified
          if (requireQuery) {
            const platformQuery = `?platform=${requireQuery.platform}`;

            ['userRequest', 'rawRequest', 'resource'].forEach(key => {
              // remove platform query string
              data[key] = data[key].substring(0, data[key].length - platformQuery.length);
            });

            data.loaders.push(`${platformLoader}${platformQuery}`);
            data.request = data.loaders.join('!') + '!' + data.resource;
          }
          callback(null, data);
        });
      });
    }

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
