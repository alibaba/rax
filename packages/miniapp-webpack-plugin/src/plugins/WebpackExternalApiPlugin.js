const webpack = require("webpack");

const geExternalApi = require('../utils/getExternalApi');
const apiLoader = require.resolve('../loaders/ExternalAPILoader');
const MemoryFS = require('memory-fs');

module.exports = class WebpackExternalApiPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    compiler.hooks.emit.tapAsync('Extenal', (compilation, callback) => {
      const options = compiler.options;

      const apiPath = geExternalApi();

      if (!apiPath) {
        return;
      }
      
      const config = {
        entry: {
          api: apiLoader + '!' +apiPath
        },
        output: {
          path: options.output.path,
          filename: '[name].js',
        },
        mode: options.mode,
        module: options.module
      };

      const apiCompiler = webpack(config);
      const fs = new MemoryFS();
      apiCompiler.outputFileSystem = fs;

      apiCompiler.run((err, stats) => {
        if (err) {
          throw err;
        }

        const content = fs.readFileSync(options.output.path + '/api.js');

        compilation.assets['api.js'] = {
          source: () => content,
          size: () => content.length
        };

        callback();
      });
    });
  }
}