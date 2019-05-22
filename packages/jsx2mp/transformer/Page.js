const { resolve } = require('path');
const { transformJSX, writeFiles } = require('./Transformer');
const { createComponent } = require('./Component');
const resolveModule = require('../utils/moduleResolve');

/**
 * Creat page files
 * @param rootContext  {String} Root Path
 * @param distContext {String} Dist path to a file.
 * @param sourcePath {String} User defined path.
 */
const createPage = function(rootContext, distContext, sourcePath) {

  const sourceFilePath = resolveModule(rootContext + '/index.js', './' + sourcePath, '.jsx') || resolveModule(rootContext + '/index.js', './' + sourcePath, '.js'); //TODO: 改一下

  const transformed = transformJSX(sourceFilePath, 'page');
  console.log({
    transformed
  })
  // createComponent(rootContext, distPagePath, {
  //   usingComponents: transformed.usingComponents,
  // });
  // writeFiles(resolve(distPagePath, 'index'), transformed, rootContext);
};

module.exports = {
  createPage
};
