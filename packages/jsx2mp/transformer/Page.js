const { resolve } = require('path');
const { transformJSX, writeFiles } = require('./Transformer');
const { createComponent } = require('./Component');

/**
 * Creat page files
 * @param distPagePath {String} dist Path
 * @param config {Object} has usingComponents
 * @param rootContext {String} root Path
 */
const createPage = function(rootContext, context, distPagePath) {
  const transformed = transformJSX(context + '.jsx', 'page');
  createComponent(rootContext, distPagePath, {usingComponents: transformed.usingComponents});
  writeFiles(resolve(distPagePath, 'index'), transformed, rootContext);
};

module.exports = {
  createPage
};
