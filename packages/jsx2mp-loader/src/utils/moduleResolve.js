const {
  sep,
  join,
  dirname,
  relative
} = require('path');
const {
  existsSync,
  statSync,
} = require('fs-extra');

const { removeExt } = require('./pathHelper');

function startsWith(prevString, nextString) {
  return prevString.indexOf(nextString) === 0;
}

function startsWithArr(prevString, nextStringArr = []) {
  return nextStringArr.some(nextString => startsWith(prevString, nextString));
}

function loadAsFile(module, extensions) {
  if (existsSync(module) && statSync(module).isFile()) {
    return removeExt(module);
  }
  for (let e of extensions) {
    if (existsSync(module + e) && statSync(module + e).isFile()) {
      return module;
    }
  }
}

function loadAsDirectory(module, extensions) {
  if (!existsSync(module)) {
    return;
  }
  let stat = statSync(module);
  if (stat.isDirectory()) {
    for (let e of extensions) {
      const indexFile = join(module, `index${e}`);
      if (existsSync(indexFile) && statSync(indexFile).isFile()) {
        return join(module, 'index');
      }
    }
  } else if (stat.isFile()) {
    return loadAsFile(module, extensions);
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
 * @param {string} script
 * @param {string} dependency
* @param {array<string>} extensions
* @return {*}
*/
module.exports = function resolve(script, dependency, extensions = ['.js', '.jsx', '.ts', '.tsx']) {
  let target;
  if (startsWithArr(dependency, ['./', '../', '/', '.\\', '..\\', '\\'])) {
    let dependencyPath = join(script, dependency);
    target = loadAsFile(dependencyPath, extensions) || loadAsDirectory(dependencyPath, extensions);
    target = relative(script, target);
  } else {
    target = loadNpmModules(dependency, dirname(script), extensions);
  }
  return target;
};
