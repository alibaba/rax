const { getAppConfig, getPages } = require('./helpers/getAppConfig');

exports.getWebpackConfig = require('./config/getWebpackConfig');
exports.getMiniappType = require('./helpers/getMiniappType');
exports.goldlog = require('./helpers/goldlog');

exports.getAppConfig = getAppConfig;
exports.getPages = getPages;