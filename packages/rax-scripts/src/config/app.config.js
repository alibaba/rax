const fs = require('fs');
const pathConfig = require('./path.config');

const appConfig = fs.existsSync(pathConfig.appConfig) ? require(pathConfig.appConfig) : {};

module.exports = appConfig;