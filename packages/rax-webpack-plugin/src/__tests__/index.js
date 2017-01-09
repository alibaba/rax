import fs from 'fs';
import os from 'os';
import path from 'path';
import rimraf from 'rimraf';
import webpack from 'webpack';

const fixtures = fs.readdirSync(path.join(__dirname, 'fixtures')).filter(function(fixture) {
  return fixture.indexOf('.') !== 0;
});

let outputDirectory = path.join(os.tmpdir(), '__output__');
// let outputDirectory = path.join(__dirname, '__output__');

function readFileOrEmpty(filepath) {
  try {
    return fs.readFileSync(filepath, 'utf-8');
  } catch (e) {
    return '';
  }
}

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

          const actual = readFileOrEmpty(actualPath);
          const expected = readFileOrEmpty(filePath);

          expect(actual).toBe(expected);

          if (fs.existsSync(fixtureTestSuiteFile)) {
            require(fixtureTestSuiteFile)(actual, expected);
          }
        });
        done();
      });
    });
  });
});
