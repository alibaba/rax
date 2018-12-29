const webpack = require("webpack");
const MemoryFS = require('memory-fs');
const { resolve } = require('path');
const { existsSync } = require('fs');

const { getAppConfig } = require('../utils/getAppConfig');
const apiLoader = require.resolve('../loaders/ExternalAPILoader');

module.exports = class WebpackExternalApiPlugin {
  constructor(options) {
    this.api = options.api;
  }

  apply(compiler) {
    if (!existsSync(this.api)) {
      throw new Error('WebpackExternalApiPlugin: could not load file ' + this.api);
    }

    compiler.hooks.emit.tapAsync('WebpackExternalApiPlugin', (compilation, callback) => {
      const options = compiler.options;
      const outputPath = options.output.path;
      const fs = new MemoryFS();

      const config = {
        entry: {
          api: apiLoader + '!' + this.api
        },
        output: {
          path: outputPath,
          filename: '[name].js',
        },
        mode: options.mode,
        module: options.module
      };

      const apiCompiler = webpack(config);
      apiCompiler.outputFileSystem = fs;
      
      apiCompiler.run((err, stats) => {
        if (err) {
          throw err;
        }

        const content = fs.readFileSync(outputPath + '/api.js');
        compilation.assets['api.js'] = {
          source: () => content,
          size: () => content.length
        };

        callback();
      });
    });
  }
}