import fs from 'fs';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

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

let outputDirectory = path.join(os.tmpdir(), '__output__');
// let outputDirectory = path.join(__dirname, '__output__');

describe('rax-webpack-plugin', function() {
  afterAll(function(done) {
    rimraf(outputDirectory, function() {
      done();
    });
  });

  fixtures.forEach(function(fixture) {
    it(fixture, function(done) {
      const testDirectory = path.join(__dirname, 'fixtures', fixture);
      let outputPath = path.join(outputDirectory, fixture);

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
      };
      if (!options.output.path) {
        options.output.path = outputPath;
      };

      webpack(options, function(err, stats) {
        expect(err).toBeNull();
        expect(stats.hasErrors()).toBe(false);

        const expectedDirectory = path.join(testDirectory, 'expected');
        const fixtureTestSuiteFile = path.join(testDirectory, 'test.js');
        fs.readdirSync(expectedDirectory).forEach(function(file) {
          const filePath = path.join(expectedDirectory, file);
          const actualPath = path.join(outputPath, file);

          if (fs.existsSync(fixtureTestSuiteFile)) {
            require(fixtureTestSuiteFile)(actualPath, filePath);
          }
        });
        done();
      });
    });
  });
});
