/*
  MIT License http://www.opensource.org/licenses/mit-license.php
  Author Tobias Koppers @sokra
*/
'use strict';

const Template = require('./Template');

class JsonpMainTemplatePlugin {
  apply(mainTemplate) {
    try {
      mainTemplate.hooks.hotBootstrap.tap('RaxJsonpMainTemplatePlugin', this.onBootstrap);
      mainTemplate.hooks.hash.tap('RaxJsonpMainTemplatePlugin', this.onHash);
    } catch (e) {
      mainTemplate.plugin('bootstrap', this.onBootstrap);
      mainTemplate.plugin('hash', this.onHash);
    }
  }

  onHash(hash) {
    hash.update('jsonp');
    hash.update('4');
    hash.update(`${this.outputOptions.filename}`);
    hash.update(`${this.outputOptions.chunkFilename}`);
    hash.update(`${this.outputOptions.jsonpFunction}`);
    hash.update(`${this.outputOptions.hotUpdateFunction}`);
  }

  onBootstrap(source, chunk, hash) {
    const hotUpdateChunkFilename = this.outputOptions.hotUpdateChunkFilename;
    const hotUpdateMainFilename = this.outputOptions.hotUpdateMainFilename;
    const hotUpdateFunction = this.outputOptions.hotUpdateFunction;
    const currentHotUpdateChunkFilename = this.applyPluginsWaterfall(
      'asset-path',
      JSON.stringify(hotUpdateChunkFilename),
      {
        hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
        hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`,
        chunk: {
          id: '" + chunkId + "'
        }
      }
    );
    const currentHotUpdateMainFilename = this.applyPluginsWaterfall(
      'asset-path',
      JSON.stringify(hotUpdateMainFilename),
      {
        hash: `" + ${this.renderCurrentHashCode(hash)} + "`,
        hashWithLength: length => `" + ${this.renderCurrentHashCode(hash, length)} + "`
      }
    );
    const runtimeSource = Template.getFunctionContent(require('./RaxJsonpMainTemplate.runtime.js'))
      .replace(/\/\/\$semicolon/g, ';')
      .replace(/\$require\$/g, this.requireFn)
      .replace(/\$hotMainFilename\$/g, currentHotUpdateMainFilename)
      .replace(/\$hotChunkFilename\$/g, currentHotUpdateChunkFilename)
      .replace(/\$hash\$/g, JSON.stringify(hash));
    return `${source}
function hotDisposeChunk(chunkId) {
delete installedChunks[chunkId];
}
var parentHotUpdateCallback = global[${JSON.stringify(hotUpdateFunction)}];
global[${JSON.stringify(hotUpdateFunction)}] = ${runtimeSource}`;
  }
}
module.exports = JsonpMainTemplatePlugin;
