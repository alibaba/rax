/**
 * Register plugins for chai.js
 */
const chaiColors = require('chai-colors'); // eslint-disable-line
chai.use(chaiColors);// eslint-disable-line

// require all test files (files that ends with .spec.js)
const testsContext = require.context('./specs', true, /\.spec$/);
testsContext.keys().forEach(testsContext);

// require all src files except main.js for coverage.
// you can also change this to match only the subset of files that
// you want coverage for.
// const srcContext = require.context('', true);
// srcContext.keys().forEach(srcContext);
