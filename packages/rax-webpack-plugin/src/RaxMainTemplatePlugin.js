import {ConcatSource} from 'webpack-sources';
import fs from 'fs';
import path from 'path';

export default class CustomUmdMainTemplatePlugin {

  constructor(options) {
    this.name = '[name]';
    this.options = options;
  }

  apply(compilation) {
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

      let moduleName = this.options.moduleName || name;
      let globalName = this.options.globalName || name;
      let target = this.options.target;
      let sourcePrefix = '';
      let sourceSuffix = '';

      // module, function is private, only use in rax internal
      if (chunk.name.endsWith('.module') || target === 'module') {
        sourcePrefix = 'module.exports = ';
        sourceSuffix = '';
      } else if (chunk.name.endsWith('.function') || target === 'function') {
        sourcePrefix = `
module.exports = function() {
  return `;
        sourceSuffix = '};';
      } else if (chunk.name.endsWith('.bundle') || target === 'bundle') {
        // Build page bundle use this mode.
        if (this.options.bundle === 'compatible') {
          sourcePrefix = `define("${chunk.name}", function(require) {`;
          sourceSuffix = `}); require("${chunk.name}");`;
        } else {
          sourcePrefix = '';
          sourceSuffix = '';
        }
      } else if (chunk.name.endsWith('.factory') || target === 'factory') {
        // Build weex builtin modules use this mode.
        // NOTE: globals should sync logic in weex-rax-framework
        if (this.options.factoryGlobals) {
          var globalsCodes = this.options.factoryGlobals.map(function(name) {
            return `var ${name} = this["${name}"];`;
          });
          sourcePrefix = `module.exports = function(require, exports, module) {
  ${globalsCodes.join('\n')}
  module.exports = `;
          sourceSuffix = '};';
        } else {
          sourcePrefix = `module.exports = function(require, exports, module) {
  with(this) { module.exports = `;
          sourceSuffix = '}};';
        }
      } else if (chunk.name.endsWith('.umd') || target === 'umd') {
        // CommonJS first that could rename module name by wrap another define in air
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
    } else if (typeof self !== "undefined") {
      root = self;
    } else if (typeof global !== "undefined") {
      root = global;
    } else {
      // NOTICE: In JavaScript strict mode, this is null
      root = this;
    }
    root["${globalName}"] = fn();
  }
})(function(){
  return `;

        sourceSuffix = '});';
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
