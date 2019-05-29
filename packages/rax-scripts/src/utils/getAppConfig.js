const fs = require('fs');
const pathConfig = require('../config/path.config');

module.exports = () => {
  if (fs.existsSync(pathConfig.appConfig)) {
    return require(pathConfig.appConfig);
  }
};