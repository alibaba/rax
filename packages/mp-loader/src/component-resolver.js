const { join } = require('path');

const RELATIVE_PATH_REG = /^\./;
const ABSOLUTE_PATH_REG = /^\//;

function resolveComponentPath(componentPath, projectPath, pagePath) {
  if (RELATIVE_PATH_REG.test(componentPath)) {
    return join(pagePath, '..', componentPath);
  } else if (ABSOLUTE_PATH_REG.test(componentPath)) {
    return join(projectPath, componentPath);
  } else {
    return join(projectPath, 'node_modules', componentPath);
  }
}

module.exports = function resolveDependencyComponents(config, projectPath, basePath) {
  const result = {};
  if (config && config.usingComponents) {
    for (let componentName in config.usingComponents) {
      if (config.usingComponents.hasOwnProperty(componentName)) {
        const declearedComponentPath = config.usingComponents[componentName];
        const isSelf = join(basePath, '..', declearedComponentPath) === basePath;
        result[componentName] = isSelf ? '__SELF__' : resolveComponentPath(
          declearedComponentPath,
          projectPath,
          basePath
        );
      }
    }
  }
  return result;
};
