const { join } = require('path');
const { transformJSX, writeFiles } = require('./Transformer');

/**
 * Creat component files
 * @param distPath {String} dist Path
 * @param config {Object} has usingComponents
 * @param rootContext {String} root Path
 */
const creatComponents = function(rootContext, distPath, config) {
  const { usingComponents = {} } = config;
  for (let [key, value] of usingComponents) {
    if (!value.external) {
      const componentDistPath = join(distPath, value.from);
      const componentSourcePath = value.absolutePath;

      const transformed = transformJSX(componentSourcePath, 'component');
      writeFiles(componentDistPath, transformed, rootContext);
      creatComponents(rootContext, distPath, { usingComponents: transformed.usingComponents });
    }
  }
};

module.exports = {
  creatComponents
};
