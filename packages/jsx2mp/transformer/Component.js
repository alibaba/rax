const { resolve, relative, extname } = require('path');
const { transformJSX, writeFiles, isCustomComponent, formatConfing } = require('./Transformer');

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
      transformed.config = formatConfing(transformed.config, rootContext);
      writeFiles(componentDistPath, transformed, rootContext);
      createComponent(rootContext, distPath, { usingComponents: transformed.usingComponents });
    }
  }
};

function removeExt(path) {
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

module.exports = {
  createComponent
};
