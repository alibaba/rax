const { join, dirname, relative } = require('path');
const { copySync, lstatSync, existsSync, mkdirpSync, writeJSONSync, writeFileSync, readFileSync, readJSONSync } = require('fs-extra');
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
  const outputPath = this._compiler.outputPath;

  const isNodeModule = cached(function isNodeModule(path) {
    return path.indexOf(currentNodeModulePath) === 0;
  });

  const getNpmFolderName = cached(function getNpmName(relativeNpmPath) {
    const isScopedNpm = relativeNpmPath[0] === '@';
    return relativeNpmPath.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
  });

  if (isNodeModule(this.resourcePath)) {
    const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
    const npmFolderName = getNpmFolderName(relativeNpmPath);
    const sourcePackagePath = join(currentNodeModulePath, npmFolderName);
    const sourcePackageJSONPath = join(sourcePackagePath, 'package.json');

    const pkg = readJSONSync(sourcePackageJSONPath);
    const npmName = pkg.name; // Update to real npm name, for that tnpm will create like `_rax-view@1.0.2@rax-view` folders.

    if ('miniappConfig' in pkg) {
      // Copy whole directory for miniapp component
      if (!dependenciesCache[npmName]) {
        dependenciesCache[npmName] = true;
        if (isSymbolic(sourcePackagePath)) {
          throw new Error('Unsupported symbol link from ' + npmName + ', please use npm or yarn instead.');
        }

        copySync(
          sourcePackagePath,
          join(outputPath, 'npm', npmName)
        );
        // modify referenced component location
        if (pkg.miniappConfig.main) {
          const componentConfigPath = join(outputPath, 'npm', npmName, pkg.miniappConfig.main + '.json');
          if (existsSync(componentConfigPath)) {
            const componentConfig = readJSONSync(componentConfigPath);
            if (componentConfig.usingComponents) {
              for (let key in componentConfig.usingComponents) {
                if (componentConfig.usingComponents.hasOwnProperty(key)) {
                  componentConfig.usingComponents[key] = join('/npm', componentConfig.usingComponents[key]);
                }
              }
            }
            writeJSONSync(componentConfigPath, componentConfig);
          } else {
            this.emitWarning('Cannot found miniappConfig component for: ' + npmName);
          }
        }
      }
    } else {
      // Copy package.json
      if (!dependenciesCache[npmName]) {
        dependenciesCache[npmName] = true;
        const target = normalizeFileName(join(outputPath, 'npm', npmName, 'package.json'));
        if (!existsSync(target))
          copySync(sourcePackageJSONPath, target, { errorOnExist: false });
      }

      // Copy file
      const splitedNpmPath = relativeNpmPath.split('/');
      if (relativeNpmPath[0] === '@') splitedNpmPath.shift(); // Extra shift for scoped npm.
      splitedNpmPath.shift(); // Skip npm module package, for cnpm/tnpm will rewrite this.

      const distSourcePath = normalizeFileName(join(outputPath, 'npm', npmName, splitedNpmPath.join('/')));
      const npmRelativePath = relative(dirname(this.resourcePath), currentNodeModulePath);
      const { code, map } = transformCode(rawContent, loaderOptions, npmRelativePath);

      const distSourceDirPath = dirname(distSourcePath);
      if (!existsSync(distSourceDirPath)) mkdirpSync(distSourceDirPath);
      writeFileSync(distSourcePath, code, 'utf-8');
      writeJSONSync(distSourcePath + '.map', map);
    }
  } else {
    const relativeFilePath = relative(
      join(rootContext, dirname(loaderOptions.entryPath)),
      this.resourcePath
    );
    const distSourcePath = join(outputPath, relativeFilePath);
    const distSourceDirPath = dirname(distSourcePath);
    const npmRelativePath = relative(dirname(distSourcePath), join(outputPath, 'npm'));

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
      { npmRelativePath, normalizeFileName }

    ] // for rename npm modules.
  ];

  // Compile to ES5 for build.
  if (loaderOptions.mode === 'build') {
    presets.push(require('@babel/preset-env'));
    plugins.push(require('@babel/plugin-proposal-class-properties'));
  }

  return transformSync(rawCode, {
    presets, plugins,
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

/**
 * For that alipay build folder can not contain `@`, escape to `_`.
 */
function normalizeFileName(filename) {
  return filename.replace(/@/g, '_');
}
