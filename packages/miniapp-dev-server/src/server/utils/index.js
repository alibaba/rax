const { readFileSync } = require('fs');
const path = require('path');
const { getWebpackConfig, getMiniappType } = require('miniapp-compiler-shared');

function getPageNameByPath(srcPath) {
  return path.basename(srcPath);
}

module.exports = {
  getWebpackConfig,
};
