const { readFileSync } = require('fs');

module.exports = {
  transAppConfig: require.resolve('../helpers/transAppConfig'),
  transPageConfig: require.resolve('../helpers/transPageConfig'),
};