const { resolve } = require('path');
const { transformJSX, writeFiles, formatConfing } = require('./Transformer');
const { createComponent } = require('./Component');
const resolveModule = require('../utils/moduleResolve');

/**
 * Creat page files
 * @param rootContext  {String} Root Path
 * @param distContext {String} Dist path to a file.
 * @param sourcePath {String} User defined path.
 */
const createPage = function(rootContext, distContext, sourcePath) {
  const sourceFilePath = resolveModule(rootContext + '/index.js', './' + sourcePath, '.jsx') || resolveModule(rootContext + '/index.js', './' + sourcePath, '.js');

  const transformed = transformJSX(sourceFilePath, 'page');
  createComponent(rootContext, distContext, transformed.usingComponents);
  transformed.config = formatConfing(transformed.config, rootContext);
  writeFiles(resolve(distContext, sourcePath), transformed, rootContext);
};

module.exports = {
  createPage
};
