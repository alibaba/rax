import ConcatSource from 'webpack/lib/ConcatSource';
import fs from 'fs';
import path from 'path';

export default class RxAmdMainTemplatePlugin {

  constructor(options){
    this.name = '[name]';
    this.options = options;
  }

  apply(compilation){

    let mainTemplate = compilation.mainTemplate;

    compilation.templatesPlugin('render-with-entry', (source, chunk, hash) => {

      let externals = chunk.modules.filter( m => {
        return m.external;
      });
      let externalsDepsArray = externals.map( m => {
        return typeof m.request === 'object' ? m.request.amd : m.request;
      });
      let externalsArguments = externals.map( m => {
        return '__WEBPACK_EXTERNAL_MODULE_' + m.id + '__';
      });

      externalsArguments = externalsArguments.join(', ');
      externalsDepsArray = JSON.stringify(externalsDepsArray);

      let requireCall = '';
      let polyfills = [];
      let name = mainTemplate.applyPluginsWaterfall('asset-path', this.name, {
        hash: hash,
        chunk: chunk
      });

      if (this.options.includePolyfills) {
        if (Array.isArray(this.options.includePolyfills)) {
          polyfills = this.options.includePolyfills.map((fp) => {
            return fs.readFileSync(fp, 'utf8');
          });
        }
      }

      if (this.options.runMainModule) {
        requireCall = 'require(' + JSON.stringify(name) + ');';
      }

      return new ConcatSource(
        polyfills.join('\n') +
        'define(' + JSON.stringify(name) + ', ' + externalsDepsArray +
        ', function(require, exports, module) {\n module.exports = ', source, '\n});\n' +
        requireCall
      );
    });

    mainTemplate.plugin('global-hash-paths', (paths) => {
      if (this.name) paths.push(this.name);
      return paths;
    });

    mainTemplate.plugin('hash', (hash) => {
      hash.update('exports amd');
      hash.update(String(this.name));
    });
  }
}
