const { resolve, relative, extname } = require('path');
const { transformJSX, writeFiles } = require('./Transformer');

/**
 * Create component files
 * @param config {Object} has usingComponents
 * @param distPath {String} dist Path
 * @param rootContext {String} root Path
 */
const createComponent = function(rootContext, distPath, config) {
  const { usingComponents = {} } = config;
  for (let [key, value] of Object.entries(usingComponents)) {
    if (isCustomComponent(value)) {
      const relativePath = relative(rootContext, value);
      const componentDistPath = resolve(distPath, relativePath);
      console.log({rootContext,distPath,relativePath,componentDistPath});

      // return;
      // const componentSourcePath = value.absolutePath;
return;

      const transformed = transformJSX(value, 'component');
      writeFiles(componentDistPath, transformed, rootContext);
      createComponent(rootContext, distPath, { usingComponents: transformed.usingComponents });
    }
  }
};

function isCustomComponent(path) {
  return /^[/.]/.test(path);
}

function removeExt(path){
  const ext = extname(path);
  return path.slice(0, path.length - ext.length);
}

module.exports = {
  createComponent
};
