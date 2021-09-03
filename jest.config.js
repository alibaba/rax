// jest.config.js

// Note: If you are using babel version 7 you have to install babel-jest with
// yarn add --dev babel-jest @babel/core

module.exports = {
  'collectCoverage': true,
  'verbose': true,
  'setupFiles': [
    './scripts/jest/setupEnvironment.js',
    'jest-localstorage-mock'
  ],
  'setupFilesAfterEnv': ['./scripts/jest/setupTests.js'],
  'moduleNameMapper': {
    // https://jestjs.io/docs/en/webpack#handling-static-assets
    // For CSS Modules
    '\\.css$': '<rootDir>/scripts/jest/styleMock.js',
  },
  'testPathIgnorePatterns': [
    '/node_modules/',
    '/fixtures/',
    '/__modules__/',
    '/__files__/',
    '/lib/',
    '/dist/',
    '/es/',
  ]
};
