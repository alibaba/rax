const { resolve } = require('path');
const webpackConfig = require('./tests/webpack.test.js');
process.env.CHROME_BIN = require('puppeteer').executablePath();

// karma.conf.js
module.exports = function(config) {
  config.set({
    browsers: ['ChromeHeadless'],
    frameworks: ['mocha', 'sinon-chai'],
    reporters: ['spec', 'coverage'],
    files: ['vendors/native-shim.js', 'tests/index.js'],

    preprocessors: {
      './tests/index.js': ['webpack', 'sourcemap']
    },

    webpack: webpackConfig,

    webpackMiddleware: {
      stats: 'errors-only'
    },
    coverageReporter: {
      dir: './coverage',
      reporters: [{ type: 'html' }, { type: 'text' }]
    }
  });
};
