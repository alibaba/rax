const { readFileSync } = require('fs-extra');
const { join, relative } = require('path');
const { copySync, readJSONSync } = require('fs-extra');
const cached = require('./cached');

const dependenciesCache = {};
module.exports = function fileLoader(content) {
  const rawContent = readFileSync(this.resourcePath);
  const rootContext = this.rootContext;
  const currentNodeModulePath = join(rootContext, 'node_modules');
  const distPath = this._compiler.outputPath;

  const isNodeModule = cached(function isNodeModule(path) {
    return path.indexOf(currentNodeModulePath)  === 0;
  });

  const getNpmName = cached(function getNpmName(relativeNpmPath) {
    const dirname = (/([^\/]+)\//.exec(relativeNpmPath) || [])[1];
    const pkgPath = join(dirname, 'package.json');
    const pkg = readJSONSync(join(currentNodeModulePath, pkgPath));
    return pkg.name;
  });

  if (isNodeModule(this.resourcePath)) {
    const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
    const npmName = getNpmName(relativeNpmPath);

    if (!dependenciesCache[npmName]) {
      dependenciesCache[npmName] = true;
      // Copy a whole directory.
      copySync(
        join(currentNodeModulePath, npmName),
        join(distPath, 'npm', npmName)
      );
    }
  } else {
    const relativeFilePath = relative(rootContext, this.resourcePath);
    const distSourcePath = join(distPath, relativeFilePath);
    copySync(this.resourcePath, distSourcePath);
  }

  return content;
}

