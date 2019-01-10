const { join } = require('path');

const RELATIVE_PATH_REG = /^\./;
const ABSOLUTE_PATH_REG = /^\//;
const PLGUIN_PATH_REG = /^plugin:\/\//;
const NODE_MODULES = 'node_modules';

/**
 * Get request path for webpack to resolve.
 * eg:
 *   /path/to/project/foo
 *   -> webpack will automaticlly search for entry file in order:
 *      foo.js
 *      foo/index.js
 *      foo/index/index.js
 *      ...
 * @param componentPath {String} Requested component path.
 * @param projectPath {String} Base path for project.
 * @param pagePath {String} Path to page file.
 * @return {String} Request path.
 */
function resolveComponentPath(componentPath, projectPath, pagePath) {
  if (RELATIVE_PATH_REG.test(componentPath)) {
    return join(pagePath, '..', componentPath);
  } else if (ABSOLUTE_PATH_REG.test(componentPath)) {
    return join(projectPath, componentPath);
  } else if (PLGUIN_PATH_REG.test(componentPath)) {
    return componentPath;
  } else {
    return join(projectPath, NODE_MODULES, componentPath);
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

module.exports.resolveComponentPath = resolveComponentPath;
