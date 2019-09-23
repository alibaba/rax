const {
  existsSync
} = require('fs-extra');
const platformConfig = require('./platformConfig');

const partSuffix = ['.js', '.json'];

// e.g file:   /root/lib/miniapp/index
module.exports = function(filename, platform = 'ali') {
  const xmlSuffix = platformConfig[platform].extension.xml;
  const suffix = partSuffix.slice();
  suffix.push(xmlSuffix);
  return suffix.every(s => existsSync(filename + s));
};
