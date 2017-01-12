import fs from 'fs';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

function readFile(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf-8').trim();
  } catch (e) {
    return null;
  }
}

const fixturesDirectory = path.join(__dirname, 'fixtures');

const fixtures = fs.readdirSync(fixturesDirectory)
  .filter(function(fixture) {
    if (fixture.indexOf('.') == 0) {
      return false;
    }
    if (fs.lstatSync(path.resolve(fixturesDirectory, fixture)).isDirectory()) {
      return true;
    }
    return false;
  });


describe('rax-webpack-plugin', function() {

  function runWebpack(done, fixture, callback) {
    const outputDirectory = path.join(os.tmpdir(), '__output__');
    const testDirectory = path.join(__dirname, 'fixtures', fixture);
    const outputPath = path.join(outputDirectory, fixture);
    const configFile = path.join(testDirectory, 'webpack.config.js');

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

  it('bundle', function(done){
    runWebpack(done, 'bundle', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
      expect(actual).toMatch('// {"framework" : "Rax"}');
    });
  });

  it('bundle-compatible', function(done){
    runWebpack(done, 'bundle-compatible', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
      expect(actual).toMatch('// {"framework" : "Rax"}');
    });
  });

  it('factory', function(done){
    runWebpack(done, 'factory', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
      expect(actual).toMatch(/^module.exports = /);
    });
  });

  it('factory', function(done){
    runWebpack(done, 'factory', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
      expect(actual).toMatch(/^module.exports = /);
    });
  });

  it('factory-factoryGlobals', function(done){
    runWebpack(done, 'factory-factoryGlobals', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
      expect(actual).toMatch(/^module.exports = /);
    });
  });

  it('function', function(done){
    runWebpack(done, 'function', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
    });
  });

  it('function', function(done){
    runWebpack(done, 'function', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
    });
  });

  it('module', function(done){
    runWebpack(done, 'module', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
      expect(actual).toMatch(/^module\.exports = /);
    });
  });

  it('umd', function(done){
    runWebpack(done, 'umd', function(actualPath, filePath) {
      const actual = readFile(actualPath);
      const expected = readFile(filePath);

      expect(actual).toBe(expected);
    });
  });

});
