const {
  existsSync
} = require('fs-extra');

const suffix = ['.js', '.json', '.axml'];

// e.g file:   /root/lib/miniapp/index
module.exports = function(filename) {
  return suffix.every(s => existsSync(filename + s));
};
