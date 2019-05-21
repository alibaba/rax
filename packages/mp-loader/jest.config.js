module.exports = {
  'collectCoverage': true,
  'verbose': true,
  'testMatch': ['**/__tests__/**/*.js'],
  'testPathIgnorePatterns': [
    '/node_modules/',
    '/fixtures/',
    '/__modules__/',
    '/__files__/',
    '/__snapshots__/'
  ]
};
