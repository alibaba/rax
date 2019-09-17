const { join, dirname, relative } = require('path');
const { copySync, lstatSync, existsSync, mkdirpSync, writeJSONSync, writeFileSync, readFileSync, readJSONSync } = require('fs-extra');
const { transformSync } = require('@babel/core');
const { getOptions } = require('loader-utils');
const cached = require('./cached');

const AppLoader = require.resolve('./app-loader');
const PageLoader = require.resolve('./page-loader');
const ComponentLoader = require.resolve('./component-loader');

const MINIAPP_CONFIG_FIELD = 'miniappConfig';

module.exports = function scriptLoader(content) {
  const loaderHandled = this.loaders.some(
    ({ path }) => [AppLoader, PageLoader, ComponentLoader].indexOf(path) !== -1
  );
  if (loaderHandled) return;

  const loaderOptions = getOptions(this);
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const rootContext = this.rootContext;
  const nodeModulesPathList = getNearestNodeModulesPath(rootContext, this.resourcePath);
  const currentNodeModulePath = nodeModulesPathList[nodeModulesPathList.length - 1];
  const rootNodeModulePath = join(rootContext, 'node_modules');
  const outputPath = this._compiler.outputPath;
  const relativeResourcePath = relative(rootContext, this.resourcePath);

  const isNodeModule = cached(function isNodeModule(path) {
    return path.indexOf(rootNodeModulePath) === 0;
  });

  const getNpmFolderName = cached(function getNpmName(relativeNpmPath) {
    const isScopedNpm = /^_?@/.test(relativeNpmPath);
    return relativeNpmPath.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
  });

  if (isNodeModule(this.resourcePath)) {
    const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
    const npmFolderName = getNpmFolderName(relativeNpmPath);
    const sourcePackagePath = join(currentNodeModulePath, npmFolderName);
    const sourcePackageJSONPath = join(sourcePackagePath, 'package.json');

    const pkg = readJSONSync(sourcePackageJSONPath);
    const npmName = pkg.name; // Update to real npm name, for that tnpm will create like `_rax-view@1.0.2@rax-view` folders.

    // Is miniapp compatible component.
    if (pkg.hasOwnProperty(MINIAPP_CONFIG_FIELD) && pkg.miniappConfig.main) {
      // Only copy first level directory for miniapp component
      const firstLevelFolder = pkg.miniappConfig.main.split('/')[0];
      const source = join(sourcePackagePath, firstLevelFolder);
      const target = join(outputPath, 'npm', npmName, firstLevelFolder);
      mkdirpSync(target);
      copySync(source, target, {
        filter: (filename) => !/__(mocks|tests?)__/.test(filename),
      });

      // Modify referenced component location
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
    } else {
      // Copy file
      const splitedNpmPath = relativeNpmPath.split('/');
      if (/^_?@/.test(relativeNpmPath)) splitedNpmPath.shift(); // Extra shift for scoped npm.
      splitedNpmPath.shift(); // Skip npm module package, for cnpm/tnpm will rewrite this.

      const { code, map } = transformCode(rawContent, loaderOptions, nodeModulesPathList, relativeResourcePath);

      const distSourcePath = normalizeFileName(join(outputPath, 'npm', relative(rootNodeModulePath, this.resourcePath))).replace(/node_modules/g, 'npm');

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

    const { code } = transformCode(rawContent, loaderOptions, nodeModulesPathList, relativeResourcePath);

    if (!existsSync(distSourceDirPath)) mkdirpSync(distSourceDirPath);
    writeFileSync(distSourcePath, code, 'utf-8');
  }

  return content;
};

function transformCode(rawCode, loaderOptions, nodeModulesPathList = [], resourcePath) {
  const presets = [];
  const plugins = [
    [
      require('./babel-plugin-rename-import'),
      { normalizeFileName, nodeModulesPathList }

    ], // for rename npm modules.
    require('@babel/plugin-proposal-export-default-from'), // for support of export defualt
    [
      require('babel-plugin-transform-define'),
      {
        'process.env.NODE_ENV': loaderOptions.mode === 'build' ? 'production' : 'development',
      }
    ],
    [
      require('babel-plugin-minify-dead-code-elimination'),
      { optimizeRawSize: true }
    ]
  ];

  // Compile to ES5 for build.
  if (loaderOptions.mode === 'build') {
    presets.push(require('@babel/preset-env'));
    plugins.push(require('@babel/plugin-proposal-class-properties'));
  }

  const babelParserOption = {
    plugins: [
      'classProperties',
      'jsx',
      'flow',
      'flowComment',
      'trailingFunctionCommas',
      'asyncFunctions',
      'exponentiationOperator',
      'asyncGenerators',
      'objectRestSpread',
      ['decorators', { decoratorsBeforeExport: false }],
      'dynamicImport',
    ], // support all plugins
  };

  return transformSync(rawCode, {
    presets,
    plugins,
    filename: resourcePath,
    parserOpts: babelParserOption,
  });
}

/**
 * For that alipay build folder can not contain `@`, escape to `_`.
 */
function normalizeFileName(filename) {
  return filename.replace(/@/g, '_');
}

// root: /Users/chriscindy/Code/Test/myRaxMiniapp5.0
// current: /Users/chriscindy/Code/Test/myRaxMiniapp5.0/node_modules/rax/lib/vdom/shouldUpdateComponent.js
function getNearestNodeModulesPath(root, current) {
  const relativePathArray = relative(root, current).split('/');
  let index = root;
  const result = [];
  while (index !== current) {
    const ifNodeModules = join(index, '/node_modules');
    if (existsSync(ifNodeModules)) {
      result.push(ifNodeModules);
    }
    index = join(index, relativePathArray.shift());
  }
  return result;
}
