const { resolve, relative } = require('path');
const { transformJSX, writeFiles, isCustomComponent, formatConfing } = require('./Transformer');
const removeExt = require('../utils/removeExt');

/**
 * Create component files
 * @param usingComponents {Object} using Components
 * @param distPath {String} dist Path
 * @param rootContext {String} root Path
 */
const createComponent = function(rootContext, distPath, usingComponents) {
  for (let [key, value] of Object.entries(usingComponents)) {
    if (isCustomComponent(value)) {
      const relativePath = relative(rootContext, value);
      const componentDistPath = removeExt(resolve(distPath, relativePath));
      const transformed = transformJSX(value, 'component');
      createComponent(rootContext, distPath, transformed.config.usingComponents);
      transformed.config = formatConfing(transformed.config, rootContext);
      writeFiles(componentDistPath, transformed, rootContext);
    }
  }
};

module.exports = {
  createComponent
};
