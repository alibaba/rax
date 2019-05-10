const { sep, join, dirname } = require('path');
const { existsSync, statSync, readFileSync } = require('fs-extra');

function startsWith(prevString, nextString) {
  return prevString.indexOf(nextString) === 0;
}

function loadAsFile(module, extension) {
  if (existsSync(module + extension) && statSync(module + extension).isFile()) {
    return module + extension;
  }

  if (existsSync(module) && statSync(module).isFile()) {
    return module;
  }
}

function loadAsDirectory(module, extension) {
  if (!existsSync(module)) {
    return;
  }

  let stat = statSync(module);

  if (stat.isDirectory()) {
    let packagePath = module + '/package.json';
    if (existsSync(packagePath) && statSync(packagePath).isFile()) {
      let pkg = JSON.parse(readFileSync(packagePath, 'utf-8'));
      let main = join(module, pkg.main || 'index' + extension);
      return loadAsFile(main) || loadAsDirectory(main);
    } else if (existsSync(module + '/index' + extension) && statSync(module + '/index' + extension).isFile()) {
      return join(module, '/index' + extension);
    }
  } else if (stat.isFile()) {
    return loadAsFile(module, extension);
  }
}

function nodeModulesPaths(start) {
  let parts = start.split(sep);

  if (!parts[parts.length - 1]) {
    parts.pop();
  }

  let i = parts.length - 1;
  let dirs = [];
  while (i >= 0) {
    if ('node_modules' === parts[i]) {
      i -= 1;
      continue;
    }
    let dir = join(parts.slice(0, i + 1).join(sep) || sep, 'node_modules');
    dirs.push(dir);
    i -= 1;
  }
  return dirs;
}

function loadNpmModules(module, start, extension) {
  let target;
  let paths = nodeModulesPaths(start);

  for (let i = 0; i < paths.length; ++i) {
    let dependencyPath = join(paths[i], module);
    target = loadAsFile(dependencyPath, extension) || loadAsDirectory(dependencyPath, extension);

    if (target) {
      break;
    }
  }
  return target;
}

/**
 * Resolve node path.
 * @param script
 * @param dependency
 * @param extension
 * @return {*}
 */
module.exports = function resolve(script, dependency, extension = '.js') {
  let target;
  if (startsWith(dependency, './') || startsWith(dependency, '/') || startsWith(dependency, '../')) {
    let dependencyPath = join(dirname(script), dependency);
    target = loadAsFile(dependencyPath, extension) || loadAsDirectory(dependencyPath, extension);
  } else {
    target = loadNpmModules(dependency, dirname(script), extension);
  }
  return target;
};
