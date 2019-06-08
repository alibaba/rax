'use strict';
var jest = require('jest-cli');

module.exports = function test(type = 'component') {
  var options = {
    projects: [process.cwd()],
    collectCoverage: true,
    verbose: true,
    transform: JSON.stringify({'^.+\\.(js|jsx|ts|tsx)$': require.resolve('./utils/babelTransformer.js')}),
    setupFiles: [
      require.resolve('jest-localstorage-mock')
    ],
    testPathIgnorePatterns: [
      '/node_modules/',
      '/fixtures/',
      '/__modules__/',
      '/__files__/',
      '/lib/',
      '/dist/',
    ]
  };
  jest.runCLI(options, options.projects, (result) => {
    if (result.numFailedTestSuites || result.numFailedTests) {
      console.error('Jest runCLI error', result);
      return;
    }
  });
};
