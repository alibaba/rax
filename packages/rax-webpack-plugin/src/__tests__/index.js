import fs from 'fs';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

/**
 * If you need to update the webpack output code
 * Use command:
 *   RAX_FIXTURE=WEBPACK_PLUGIN npm test -- ./packages/rax-webpack-plugin/src/__tests__/index.js
 */


describe('rax-webpack-plugin', function() {
  const outputDirectory = path.join(os.tmpdir(), '__output__');

  function readFile(filepath) {
    try {
      return fs.readFileSync(filepath, 'utf-8').trim();
    } catch (e) {
      return null;
    }
  }

  function runWebpack(done, fixture, callback) {
    const testDirectory = path.join(__dirname, 'fixtures', fixture);
    let outputPath = path.join(outputDirectory, fixture);
    const configFile = path.join(testDirectory, 'webpack.config.js');


    if (process.env.RAX_FIXTURE === 'WEBPACK_PLUGIN') {
      outputPath = path.join(__dirname, 'fixtures', fixture, 'expected');
    }

    let options;

    if (fs.existsSync(configFile)) {
      options = require(configFile);
    } else {
      done.fail(`fixture '${fixture}' directory not exist webpack.config.js`);
    }

    options.context = testDirectory;

    if (!options.output) {
      options.output = {
        filename: '[name].js'
      };
    }

    if (!options.output.path) {
      options.output.path = outputPath;
    }

    const expectedDirectory = path.join(testDirectory, 'expected');

    webpack(options, function(err, stats) {
      expect(err).toBeNull();
      expect(stats.hasErrors()).toBe(false);

      fs.readdirSync(expectedDirectory).forEach(function(file) {
        const filePath = path.join(expectedDirectory, file);
        const actualPath = path.join(outputPath, file);
        callback(actualPath, filePath);
      });

      done();
    });
  }

  afterAll(function(done) {
    rimraf(outputDirectory, function() {
      done();
    });
  });

  it('bundle', function(done) {
    runWebpack(done, 'bundle', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      expect(actual).toMatch('bundle-target');
      expect(actual).toMatch('// {"framework" : "Rax"}');
    });
  });

  it('custom', function(done) {
    runWebpack(done, 'custom', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      expect(actual).toMatch('customDefine');
      expect(actual).toMatch('custom-target');
      expect(actual).toMatch('// {"framework" : "Rax"}');
    });
  });

  it('bundle-compatible', function(done) {
    runWebpack(done, 'bundle-compatible', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch('define("index.bundle"');
      expect(actual).toMatch('require("index.bundle")');
      expect(actual).toMatch('bundle-compatible-target');
      expect(actual).toMatch('// {"framework" : "Rax"}');
    });
  });

  it('factory', function(done) {
    runWebpack(done, 'factory', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch('module.exports = function(require, exports, module) {');
      expect(actual).toMatch('with(this) { module.exports =');
    });
  });

  it('factory-factoryGlobals', function(done) {
    runWebpack(done, 'factory-factoryGlobals', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch('module.exports = function(require, exports, module) {');
      expect(actual).toMatch('var window = this["window"];');
      expect(actual).toMatch('factory-factoryGlobals-target');
    });
  });

  it('function', function(done) {
    runWebpack(done, 'function', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch('module.exports = function() {');
      expect(actual).toMatch('function-target');
    });
  });

  it('module', function(done) {
    runWebpack(done, 'module', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch(/^module\.exports = /);
      expect(actual).toMatch('module-target');
    });
  });

  it('umd', function(done) {
    runWebpack(done, 'umd', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch('define("index.umd", function(require, exports, module){');
      expect(actual).toMatch('umd-target');
    });
  });

  it('cmd', function(done) {
    runWebpack(done, 'cmd', function(actualPath, filePath) {
      const actual = readFile(actualPath);

      expect(actual).toMatch('define("index.cmd", function(require, exports, module){');
      expect(actual).toMatch('cmd-target');
    });
  });
});
