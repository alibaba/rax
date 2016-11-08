import ConcatSource from 'webpack/lib/ConcatSource';
import fs from 'fs';
import path from 'path';

export default class CustomUmdMainTemplatePlugin {

  constructor(options){
    this.name = '[name]';
    this.options = options;
  }

  apply(compilation){

    let mainTemplate = compilation.mainTemplate;

    compilation.templatesPlugin('render-with-entry', (source, chunk, hash) => {

      let requireCall = '';
      let polyfills = [];
      let name = mainTemplate.applyPluginsWaterfall('asset-path', this.name, {
        hash: hash,
        chunk: chunk
      });

      if (this.options.includePolyfills) {
        let polyfillModules = this.options.polyfillModules;
        polyfills = polyfillModules.map((fp) => {
          return fs.readFileSync(fp, 'utf8');
        });
      }

      // FIXME: could remove?
      if (this.options.runMainModule) {
        requireCall = `
if (typeof require === "function"){
  require(${JSON.stringify(name)});
}`;
      }

      let moduleName = this.options.moduleName || name;
      let globalName = this.options.globalName || name;
      let sourcePrefix = '';
      let sourceSuffix = '';

      // Only weex-rx-framework build use this build mode.
      if (chunk.name.endsWith('.framework')) {
        sourcePrefix = 'module.exports = ';
        sourceSuffix = '';
      } else if (chunk.name.endsWith('.bundle')) {
        // Build page bundle use this mode.
        sourcePrefix = '';
        sourceSuffix = '';
      } else if (chunk.name.endsWith('.factory')) {
        // Build weex builtin modules use this mode.
        // NOTE: globals should sync logic in weex-rx-framework
        let factoryDependencies = [
          // ES
          'Promise',
          // W3C
          'window',
          'screen',
          'document',
          'navigator',
          'location',
          'fetch',
          'Headers',
          'Response',
          'Request',
          'URL',
          'URLSearchParams',
          'setTimeout',
          'clearTimeout',
          'setInterval',
          'clearInterval',
          'requestAnimationFrame',
          'cancelAnimationFrame',
          'alert',
          // Weex
          '__weex_define__',
          '__weex_require__',
          '__weex_options__',
          '__weex_data__',
          '__weex_downgrade__',
          // ModuleJS
          'require',
          'exports',
          'module'
        ];
        sourcePrefix = `
module.exports = function(${factoryDependencies}) {
  module.exports = `;
        sourceSuffix = `};`;
      } else {
        // Default build mode for component
        sourcePrefix = `
;(function(fn) {
  if (typeof exports === "object" && typeof module !== "undefined") {
    module.exports = fn();
  } else if (typeof define === "function") {
    define(${JSON.stringify(moduleName)}, function(require, exports, module){
      module.exports = fn();
    });
  } else {
    var root;
    if (typeof window !== "undefined") {
      root = window;
    } else if (typeof global !== "undefined") {
      root = global;
    } else if (typeof self !== "undefined") {
      root = self;
    } else {
      // NOTICE: In JavaScript strict mode, this is null
      root = this;
    }
    root.${globalName} = fn();
  }
})(function(){
  return `;

        sourceSuffix = `});`;
      }

      return new ConcatSource(
        polyfills.join('\n'),
        sourcePrefix,
        source,
        sourceSuffix,
        requireCall
      );
    });

    mainTemplate.plugin('global-hash-paths', (paths) => {
      if (this.name) paths = paths.concat(this.name);
		  return paths;
    });

    mainTemplate.plugin('hash', (hash) => {
      hash.update('custom-umd');
      hash.update(String(this.name));
    });
  }
}
