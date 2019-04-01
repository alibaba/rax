const webpack = require('webpack');
const { join } = require('path');
const MemoryFS = require('memory-fs');
const { existsSync } = require('fs');

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

      const config = {
        watch: true,
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
      const fs = new MemoryFS();
      apiCompiler.outputFileSystem = fs;

      apiCompiler.watch(null, (err, stats) => {
        if (err) {
          throw err;
        }

        // Export compile result.
        console.log('API Built.');
        console.log(stats.toString({
          colors: true
        }));

        try {
          const content = fs.readFileSync(join(outputPath, 'api.js'));
          compilation.assets['api.js'] = {
            source: () => content,
            size: () => content.length
          };
        } catch (error) {
          console.log('Can not read compile output', err);
        }

        callback();
      });
    });
  }
};
