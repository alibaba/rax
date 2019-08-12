const { join, dirname, relative } = require('path');
const {
  copySync,
  lstatSync,
  existsSync,
  mkdirpSync,
  writeJSONSync,
  writeFileSync,
  readFileSync,
  readJSONSync
} = require('fs-extra');
const { transformSync } = require('@babel/core');
const { getOptions } = require('loader-utils');
const cached = require('./cached');

const AppLoader = require.resolve('./app-loader');
const PageLoader = require.resolve('./page-loader');
const ComponentLoader = require.resolve('./component-loader');

const dependenciesCache = {};
module.exports = function fileLoader(content) {
  const loaderHandled = this.loaders.some(
    ({ path }) => [AppLoader, PageLoader, ComponentLoader].indexOf(path) !== -1
  );
  if (loaderHandled) return;

  const loaderOptions = getOptions(this);
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const rootContext = this.rootContext;
  const currentNodeModulePath = join(rootContext, 'node_modules');
  const distPath = this._compiler.outputPath;

  const isNodeModule = cached(function isNodeModule(path) {
    return path.indexOf(currentNodeModulePath) === 0;
  });

  const getNpmName = cached(function getNpmName(relativeNpmPath) {
    const isScopedNpm = relativeNpmPath[0] === '@';
    return relativeNpmPath
      .split('/')
      .slice(0, isScopedNpm ? 2 : 1)
      .join('/');
  });

  if (isNodeModule(this.resourcePath)) {
    const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
    const npmName = getNpmName(relativeNpmPath);
    const sourcePackageJSONPath = join(
      currentNodeModulePath,
      npmName,
      'package.json'
    );
    if ('miniappConfig' in readJSONSync(sourcePackageJSONPath)) {
      // is miniapp component
      // Copy whole directory
      if (!dependenciesCache[npmName]) {
        dependenciesCache[npmName] = true;
        if (isSymbolic(join(currentNodeModulePath, npmName))) {
          throw new Error(
            'Unsupported symbol link from ' +
              npmName +
              ', please use npm or yarn instead.'
          );
        }
        copySync(
          join(currentNodeModulePath, npmName),
          join(distPath, 'npm', npmName)
        );
      }
    } else {
      // Copy package.json
      if (!dependenciesCache[npmName]) {
        dependenciesCache[npmName] = true;
        const target = join(distPath, 'npm', npmName, 'package.json');
        if (!existsSync(target))
          copySync(sourcePackageJSONPath, target, { errorOnExist: false });
      }

      // Copy file
      const splitedNpmPath = relativeNpmPath.split('/');
      if (relativeNpmPath[0] === '@') splitedNpmPath.shift(); // Extra shift for scoped npm.
      splitedNpmPath.shift(); // Skip npm module package, for cnpm/tnpm will rewrite this.
      const distSourcePath = join(
        distPath,
        'npm',
        npmName,
        splitedNpmPath.join('/')
      );
      const { code, map } = transformCode(rawContent, loaderOptions);
      const distSourceDirPath = dirname(distSourcePath);
      if (!existsSync(distSourceDirPath)) mkdirpSync(distSourceDirPath);
      writeFileSync(distSourcePath, code, 'utf-8');
      writeJSONSync(distSourcePath + '.map', map);
    }
  } else {
    const relativeFilePath = relative(
      join(rootContext, loaderOptions.entryPath),
      this.resourcePath
    );
    const distSourcePath = join(distPath, relativeFilePath);
    const distSourceDirPath = dirname(distSourcePath);
    const npmRelativePath = relative(dirname(distSourcePath), join(distPath, '/npm/'));
    const { code } = transformCode(rawContent, loaderOptions, npmRelativePath);

    if (!existsSync(distSourceDirPath)) mkdirpSync(distSourceDirPath);
    writeFileSync(distSourcePath, code, 'utf-8');
  }

  return content;
};

function transformCode(rawCode, loaderOptions, npmRelativePath = '') {
  const presets = [];
  const plugins = [
    [
      require('./babel-plugin-rename-import'),
      { npmRelativePath }

    ] // for rename npm modules.
  ];

  // Compile to ES5 for build.
  if (loaderOptions.mode === 'build') {
    presets.push(require('@babel/preset-env'));
    plugins.push(require('@babel/plugin-proposal-class-properties'));
  }

  return transformSync(rawCode, {
    presets,
    plugins
  });
}

function isSymbolic(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    }
    throw err;
  }
}
