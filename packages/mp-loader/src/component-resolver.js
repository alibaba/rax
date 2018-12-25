const { join } = require('path');
const { warn } = require('./utils');

const RELATIVE_PATH_REG = /^\./;
const ABSOLUTE_PATH_REG = /^\//;
const PLGUIN_PATH_REG = /^plugin:\/\//;

function resolveComponentPath(componentPath, projectPath, pagePath) {
  if (RELATIVE_PATH_REG.test(componentPath)) {
    return join(pagePath, '..', componentPath);
  } else if (ABSOLUTE_PATH_REG.test(componentPath)) {
    return join(projectPath, componentPath);
  } else if (PLGUIN_PATH_REG.test(componentPath)) {
    return componentPath;
  } else {
    return resolveNpmModule(componentPath, {
      basePath: projectPath
    });
  }
}

function resolveNpmModule(moduleName, opts = {}) {
  const basePath = opts.basePath || process.cwd();
  const modulePath = join(basePath, 'node_modules', moduleName);
  if (!existsSync(modulePath)) {
    throw new Error(`${modulePath} is not a valid path or not exists. Please check ${moduleName} is installed by npm.`)
  }

  let resolved = join(modulePath, 'index.js');
  const packageJsonPath = join(modulePath, 'package.json');
  let pkgInfo;
  if (existsSync(packageJsonPath)) {
    try {
      pkgInfo = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
    } catch(err) {
      warn(`Parsing JSON error while reading: ${packageJsonPath}.`);
    }
  }

  if (pkgInfo && pkgInfo.main) {
    resolved = join(modulePath, pkgInfo.main);
  }

  return resolved;
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
