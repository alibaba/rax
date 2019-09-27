import {ConcatSource} from 'webpack-sources';
import fs from 'fs';
import path from 'path';

export default class RaxMainTemplatePlugin {
  constructor(options) {
    this.name = '[name]';
    this.options = options;
  }

  onRenderWithEntry(mainTemplate, source, chunk, hash) {
    let requireCall = '';
    let polyfills = [];
    let name = '';

    // webpack 4 api
    if (mainTemplate.getAssetPath) {
      name = mainTemplate.getAssetPath(this.name, {
        hash,
        chunk
      });
    } else {
      name = mainTemplate.applyPluginsWaterfall('asset-path', this.name, {
        hash,
        chunk
      });
    }

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

    if (typeof this.options.sourcePrefix === 'function' &&
       typeof this.options.sourceSuffix === 'function') {
      sourcePrefix = this.options.sourcePrefix(source, chunk, hash);
      sourceSuffix = this.options.sourceSuffix(source, chunk, hash);
    } else {
      // module, function is private, only use in rax internal
      if (chunk.name.endsWith('.module') || target === 'module') {
        sourcePrefix = 'module.exports = ';
        sourceSuffix = ';';
      } else if (chunk.name.endsWith('.function') || target === 'function') {
        sourcePrefix = `module.exports = function() {
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
      } else if (chunk.name.endsWith('.cmd') || target === 'cmd') {
        sourcePrefix = `define(${JSON.stringify(moduleName)}, function(require, exports, module){
module.exports = `;
        sourceSuffix = '});';
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
    }

    return new ConcatSource(
      polyfills.join('\n'),
      sourcePrefix,
      source,
      sourceSuffix,
      requireCall
    );
  }

  // webpack 4
  applyWithTap(compilation) {
    const { mainTemplate } = compilation;

    mainTemplate.hooks.renderWithEntry.tap(
      'RaxMainTemplatePlugin',
      this.onRenderWithEntry.bind(this, mainTemplate)
    );

    mainTemplate.hooks.globalHashPaths.tap('RaxMainTemplatePlugin', paths => {
      if (this.name) paths.push(this.name);
      return paths;
    });

    mainTemplate.hooks.hash.tap('RaxMainTemplatePlugin', hash => {
      hash.update('exports rax');
      hash.update(this.name);
    });
  }

  // webpack 3
  apply(compilation) {
    // webpack 4
    if (!compilation.templatesPlugin) {
      return this.applyWithTap(compilation);
    }

    const { mainTemplate } = compilation;

    compilation.templatesPlugin('render-with-entry', this.onRenderWithEntry.bind(this, mainTemplate));

    mainTemplate.plugin('global-hash-paths', (paths) => {
      if (this.name) paths = paths.concat(this.name);
      return paths;
    });

    mainTemplate.plugin('hash', (hash) => {
      hash.update('exports rax');
      hash.update(String(this.name));
    });
  }
}
