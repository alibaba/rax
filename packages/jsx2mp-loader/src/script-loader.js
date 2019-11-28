const { join, dirname, relative } = require('path');
const { copySync, existsSync, mkdirpSync, writeJSONSync, statSync, readFileSync, readJSONSync } = require('fs-extra');
const { transformSync } = require('@babel/core');
const { getOptions } = require('loader-utils');
const cached = require('./cached');
const { removeExt, isFromTargetDirs } = require('./utils/pathHelper');
const { isNpmModule } = require('./utils/judgeModule');
const output = require('./output');

const AppLoader = require.resolve('./app-loader');
const PageLoader = require.resolve('./page-loader');
const ComponentLoader = require.resolve('./component-loader');

const MINIAPP_CONFIG_FIELD = 'miniappConfig';

module.exports = function scriptLoader(content) {
  const loaderOptions = getOptions(this);
  const { disableCopyNpm, mode, entryPath, platform, constantDir, importedComponent = '' } = loaderOptions;
  const rootContext = this.rootContext;
  const absoluteConstantDir = constantDir.map(dir => join(rootContext, dir));
  const isFromConstantDir = cached(isFromTargetDirs(absoluteConstantDir));

  const loaderHandled = this.loaders.some(
    ({ path }) => [AppLoader, PageLoader, ComponentLoader].indexOf(path) !== -1
  );
  if (loaderHandled && !isFromConstantDir(this.resourcePath)) return;

  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const nodeModulesPathList = getNearestNodeModulesPath(rootContext, this.resourcePath);
  const currentNodeModulePath = nodeModulesPathList[nodeModulesPathList.length - 1];
  const rootNodeModulePath = join(rootContext, 'node_modules');
  const outputPath = this._compiler.outputPath;
  const relativeResourcePath = relative(rootContext, this.resourcePath);

  const isFromNodeModule = cached(function isFromNodeModule(path) {
    return path.indexOf(rootNodeModulePath) === 0;
  });

  const getNpmFolderName = cached(function getNpmName(relativeNpmPath) {
    const isScopedNpm = /^_?@/.test(relativeNpmPath);
    return relativeNpmPath.split('/').slice(0, isScopedNpm ? 2 : 1).join('/');
  });

  if (isFromNodeModule(this.resourcePath)) {
    if (disableCopyNpm) {
      return '';
    }
    const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
    const npmFolderName = getNpmFolderName(relativeNpmPath);
    const sourcePackagePath = join(currentNodeModulePath, npmFolderName);
    const sourcePackageJSONPath = join(sourcePackagePath, 'package.json');

    const pkg = readJSONSync(sourcePackageJSONPath);
    const npmName = pkg.name; // Update to real npm name, for that tnpm will create like `_rax-view@1.0.2@rax-view` folders.

    // Is miniapp compatible component.
    if (pkg.hasOwnProperty(MINIAPP_CONFIG_FIELD)) {
      const mainName = platform.type === 'ali' ? 'main' : `main:${platform.type}`;
      // Case 1: Single component except those old universal api with pkg.miniappConfig
      // Case 2: Component library which exports multiple components
      const isSingleComponent = !!pkg.miniappConfig[mainName];
      const isComponentLibrary = !! pkg.miniappConfig.subPackages;

      if (isSingleComponent || isComponentLibrary && pkg.miniappConfig.subPackages[importedComponent]) {
        const miniappComponentPath = isSingleComponent ? pkg.miniappConfig[mainName] : pkg.miniappConfig.subPackages[importedComponent][mainName];
        const firstLevelFolder = miniappComponentPath.split('/')[0];
        const source = join(sourcePackagePath, firstLevelFolder);
        const target = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, sourcePackagePath), firstLevelFolder));
        mkdirpSync(target);
        copySync(source, target, {
          filter: (filename) => !/__(mocks|tests?)__/.test(filename),
        });

        // Copy public files or dirs
        if (isComponentLibrary && pkg.miniappConfig.public) {
          pkg.miniappConfig.public.forEach(filePath => {
            const source = join(sourcePackagePath, filePath);
            const target = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, sourcePackagePath), filePath));

            if (statSync(source).isDirectory()) {
              mkdirpSync(target);
            }
            copySync(source, target);
          });
        }

        // Modify referenced component location according to the platform
        const componentConfigPath = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, sourcePackagePath), miniappComponentPath + '.json'));

        if (existsSync(componentConfigPath)) {
          const componentConfig = readJSONSync(componentConfigPath);
          if (componentConfig.usingComponents) {
            for (let key in componentConfig.usingComponents) {
              if (componentConfig.usingComponents.hasOwnProperty(key)) {
                const componentPath = componentConfig.usingComponents[key];
                if (isNpmModule(componentPath)) {
                  // component from node module
                  const realComponentPath = require.resolve(componentPath, {
                    paths: [this.resourcePath]
                  });
                  const originalComponentConfigPath = join(sourcePackagePath, miniappComponentPath);
                  const relativeComponentPath = normalizeNpmFileName('./' + relative(dirname(originalComponentConfigPath), realComponentPath));

                  componentConfig.usingComponents[key] = removeExt(relativeComponentPath);
                }
              }
            }
          }
          writeJSONSync(componentConfigPath, componentConfig);
        } else {
          this.emitWarning('Cannot found miniappConfig component for: ' + npmName);
        }
      }
    } else {
      // Copy file
      const splitedNpmPath = relativeNpmPath.split('/');
      if (/^_?@/.test(relativeNpmPath)) splitedNpmPath.shift(); // Extra shift for scoped npm.
      splitedNpmPath.shift(); // Skip npm module package, for cnpm/tnpm will rewrite this.
      const distSourcePath = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, this.resourcePath)));

      const distSourceDirPath = dirname(distSourcePath);
      if (!existsSync(distSourceDirPath)) mkdirpSync(distSourceDirPath);

      const outputContent = { code: rawContent };
      const outputOption = {
        outputPath: {
          code: distSourcePath
        },
        mode,
        externalPlugins: [
          [
            require('./babel-plugin-rename-import'),
            { normalizeNpmFileName,
              nodeModulesPathList,
              distSourcePath,
              resourcePath: this.resourcePath,
              outputPath,
              disableCopyNpm,
              platform
            }
          ]
        ]
      };
      output(outputContent, null, outputOption);
    }
  } else {
    const relativeFilePath = relative(
      join(rootContext, dirname(entryPath)),
      this.resourcePath
    );
    const distSourcePath = join(outputPath, relativeFilePath);
    const distSourceDirPath = dirname(distSourcePath);

    if (!existsSync(distSourceDirPath)) mkdirpSync(distSourceDirPath);
    const outputContent = { code: rawContent };
    const outputOption = {
      outputPath: {
        code: distSourcePath
      },
      mode,
      externalPlugins: [
        [
          require('./babel-plugin-rename-import'),
          { normalizeNpmFileName,
            nodeModulesPathList,
            distSourcePath,
            resourcePath: this.resourcePath,
            outputPath,
            disableCopyNpm,
            platform
          }
        ]
      ]
    };

    output(outputContent, null, outputOption);
  }

  return content;
};

/**
 * For that alipay build folder can not contain `@`, escape to `_`.
 */
function normalizeNpmFileName(filename) {
  return filename.replace(/@/g, '_').replace(/node_modules/g, 'npm');
}

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
