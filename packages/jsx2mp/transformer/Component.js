const { resolve, relative, extname } = require('path');
const { transformJSX, writeFiles, isCustomComponent } = require('./Transformer');

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
      const componentDistPath = resolve(distPath, relativePath,'..');
      const transformed = transformJSX(value, 'component');
      writeFiles(componentDistPath, transformed, rootContext);
      createComponent(rootContext, distPath, { usingComponents: transformed.usingComponents });
    }
  }
};

module.exports = {
  createComponent
};
