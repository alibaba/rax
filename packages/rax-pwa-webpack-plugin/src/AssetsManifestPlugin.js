import path from 'path';
import fs from 'fs';

const MAIN_ENTRY = 'entry';

// This plugin creates a assets-manifest.json for all assets that are being output
// Because it`s hard to know whether a page has css before compilation, so we use this plugin to generate assets info during compilation
export default class RaxAssetsManifest {
  constructor(options) {
    this.name = '[name]';
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync(
      'RaxAssetsManifestPlugin',
      (compilation, callback) => {
        const { chunks } = compilation;

        const assetsMap = {};

        const mainChunk = chunks.find(
          c => c.name === MAIN_ENTRY
        );

        const mainAssets = mainChunk ? mainChunk.files : [];

        chunks.map(chunk => {
          if (chunk.name === MAIN_ENTRY) {
            return;
          }

          const assets = mainAssets.concat(chunk.files);

          const publicPath = this.options.publicPath || './';
          const styles = [];
          const scripts = [];

          assets.map((file) => {
            if (/\.css$/.exec(file)) {
              styles.push(path.join(publicPath, file));
              return;
            }
            if (/\.js$/.exec(file)) {
              scripts.push(path.join(publicPath, file));
            }
          });

          assetsMap[chunk.name] = {
            styles,
            scripts
          };
        });

        fs.writeFileSync(this.options.dist, JSON.stringify(assetsMap, null, 2));

        callback();
      }
    );
  }
}
