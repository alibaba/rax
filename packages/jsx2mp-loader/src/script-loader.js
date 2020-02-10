const { join, dirname, relative, resolve, sep } = require('path');

const { copySync, existsSync, mkdirpSync, writeJSONSync, readFileSync, readJSONSync } = require('fs-extra');
const { getOptions } = require('loader-utils');
const cached = require('./cached');
const { removeExt, isFromTargetDirs, doubleBackslash, replaceBackSlashWithSlash, addRelativePathPrefix } = require('./utils/pathHelper');
const { isNpmModule, isJSONFile, isTypescriptFile } = require('./utils/judgeModule');
const isMiniappComponent = require('./utils/isMiniappComponent');
const output = require('./output');

const AppLoader = require.resolve('./app-loader');
const PageLoader = require.resolve('./page-loader');
const ComponentLoader = require.resolve('./component-loader');
const ScriptLoader = __filename;

const MINIAPP_CONFIG_FIELD = 'miniappConfig';

module.exports = function scriptLoader(content) {
  const loaderOptions = getOptions(this);
  const { disableCopyNpm, mode, entryPath, platform, constantDir, importedComponent = '', isRelativeMiniappComponent = false } = loaderOptions;
  const rootContext = this.rootContext;
  const absoluteConstantDir = constantDir.map(dir => join(rootContext, dir));
  const isFromConstantDir = cached(isFromTargetDirs(absoluteConstantDir));
  const isAppJSon = this.resourcePath === join(rootContext, 'src', 'app.json');

  const loaderHandled = this.loaders.some(
    ({ path }) => [AppLoader, PageLoader, ComponentLoader].indexOf(path) !== -1
  );
  if (loaderHandled && !isFromConstantDir(this.resourcePath)) return;

  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const nodeModulesPathList = getNearestNodeModulesPath(rootContext, this.resourcePath);
  const currentNodeModulePath = nodeModulesPathList[nodeModulesPathList.length - 1];
  const rootNodeModulePath = join(rootContext, 'node_modules');
  const outputPath = this._compiler.outputPath;

  const isFromNodeModule = cached(function isFromNodeModule(path) {
    return path.indexOf(rootNodeModulePath) === 0;
  });

  const getNpmFolderName = cached(function getNpmName(relativeNpmPath) {
    const isScopedNpm = /^_?@/.test(relativeNpmPath);
    return relativeNpmPath.split(sep).slice(0, isScopedNpm ? 2 : 1).join(sep);
  });

  const outputFile = (rawContent, { isFromNpm = true, isJSON = false}) => {
    let distSourcePath;
    if (isFromNpm) {
      const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
      const splitedNpmPath = relativeNpmPath.split(sep);
      if (/^_?@/.test(relativeNpmPath)) splitedNpmPath.shift(); // Extra shift for scoped npm.
      splitedNpmPath.shift(); // Skip npm module package, for cnpm/tnpm will rewrite this.
      distSourcePath = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, this.resourcePath)));
    } else {
      const relativeFilePath = relative(
        join(rootContext, dirname(entryPath)),
        this.resourcePath
      );
      distSourcePath = join(outputPath, relativeFilePath);
    }

    let outputContent = {};
    let outputOption = {};

    if (isJSON) {
      outputContent = {
        json: JSON.parse(rawContent)
      };
      outputOption = {
        outputPath: {
          json: distSourcePath
        },
        mode
      };
    } else {
      outputContent = { code: rawContent };
      outputOption = {
        outputPath: {
          code: removeExt(distSourcePath) + '.js'
        },
        mode,
        externalPlugins: [
          [
            require('./babel-plugin-rename-import'),
            { normalizeNpmFileName,
              distSourcePath,
              resourcePath: this.resourcePath,
              outputPath,
              disableCopyNpm,
              platform
            }
          ]
        ],
        isTypescriptFile: isTypescriptFile(this.resourcePath)
      };
    }

    output(outputContent, null, outputOption);
  };

  const outputDir = (source, target) => {
    if (existsSync(source)) {
      mkdirpSync(target);
      copySync(source, target, {
        overwrite: false,
        filter: filename => !/__(mocks|tests?)__/.test(filename)
      });
    }
  };

  const checkUsingComponents = (dependencies, originalComponentConfigPath, distComponentConfigPath, sourceNativeMiniappScriptFile, npmName) => {
    if (existsSync(originalComponentConfigPath)) {
      const componentConfig = readJSONSync(originalComponentConfigPath);
      if (componentConfig.usingComponents) {
        for (let key in componentConfig.usingComponents) {
          if (componentConfig.usingComponents.hasOwnProperty(key)) {
            const componentPath = componentConfig.usingComponents[key];
            if (isNpmModule(componentPath)) {
              // component from node module
              const realComponentPath = require.resolve(componentPath, {
                paths: [this.resourcePath]
              });
              const relativeComponentPath = normalizeNpmFileName(addRelativePathPrefix(relative(dirname(sourceNativeMiniappScriptFile), realComponentPath)));
              componentConfig.usingComponents[key] = replaceBackSlashWithSlash(removeExt(relativeComponentPath));
              dependencies.push({
                name: realComponentPath,
                loader: ScriptLoader, // Native miniapp component js file will loaded by script-loader
                options: loaderOptions
              });
            } else if (componentPath.indexOf(`${sep}npm${sep}`) === -1) { // Exclude the path that has been modified by jsx-compiler
              const absComponentPath = resolve(dirname(sourceNativeMiniappScriptFile), componentPath);
              dependencies.push({
                name: absComponentPath,
                loader: ScriptLoader, // Native miniapp component js file will loaded by script-loader
                options: Object.assign({ isRelativeMiniappComponent: true }, loaderOptions)
              });
            }
          }
        }
      }
      writeJSONSync(distComponentConfigPath, componentConfig);
    } else {
      this.emitWarning('Cannot found miniappConfig component for: ' + npmName);
    }
  };

  if (isFromNodeModule(this.resourcePath)) {
    if (disableCopyNpm) {
      return content;
    }
    const relativeNpmPath = relative(currentNodeModulePath, this.resourcePath);
    const npmFolderName = getNpmFolderName(relativeNpmPath);
    const sourcePackagePath = join(currentNodeModulePath, npmFolderName);
    const sourcePackageJSONPath = join(sourcePackagePath, 'package.json');

    const pkg = readJSONSync(sourcePackageJSONPath);
    const npmName = pkg.name; // Update to real npm name, for that tnpm will create like `_rax-view@1.0.2@rax-view` folders.
    const npmMainPath = join(sourcePackagePath, pkg.main || '');
    const isThirdMiniappComponent = isMiniappComponent(this.resourcePath, platform.type);

    const isUsingMainMiniappComponent = pkg.hasOwnProperty(MINIAPP_CONFIG_FIELD) && this.resourcePath === npmMainPath;
    // Is miniapp compatible component.
    if (isUsingMainMiniappComponent || isRelativeMiniappComponent || isThirdMiniappComponent) {
      const mainName = platform.type === 'ali' ? 'main' : `main:${platform.type}`;
      // Case 1: Single component except those old universal api with pkg.miniappConfig
      // Case 2: Component library which exports multiple components
      const isSingleComponent = pkg.miniappConfig && pkg.miniappConfig[mainName];
      const isComponentLibrary = pkg.miniappConfig && pkg.miniappConfig.subPackages && pkg.miniappConfig.subPackages[importedComponent];

      const dependencies = [];

      if (isSingleComponent || isComponentLibrary || isRelativeMiniappComponent) {
        const miniappComponentPath = isRelativeMiniappComponent ? relative(sourcePackagePath, this.resourcePath) : isSingleComponent ? pkg.miniappConfig[mainName] : pkg.miniappConfig.subPackages[importedComponent][mainName];
        const sourceNativeMiniappScriptFile = join(sourcePackagePath, miniappComponentPath);
        dependencies.push({
          name: sourceNativeMiniappScriptFile,
          loader: ScriptLoader, // Native miniapp component js file will loaded by script-loader
          options: loaderOptions
        });

        // Handle subComponents
        if (isComponentLibrary && pkg.miniappConfig.subPackages[importedComponent].subComponents) {
          const subComponents = pkg.miniappConfig.subPackages[importedComponent].subComponents;
          Object.keys(subComponents).forEach(subComponentName => {
            const subComponentScriptFile = join(sourcePackagePath, subComponents[subComponentName][mainName]);
            dependencies.push({
              name: subComponentScriptFile,
              loader: ScriptLoader,
              options: loaderOptions
            });
          });
        }
        const miniappComponentDir = miniappComponentPath.slice(0, miniappComponentPath.lastIndexOf('/'));
        const source = join(sourcePackagePath, miniappComponentDir);
        const target = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, sourcePackagePath), miniappComponentDir));
        outputDir(source, target);

        // Modify referenced component location according to the platform
        const originalComponentConfigPath = join(sourcePackagePath, miniappComponentPath + '.json');
        const distComponentConfigPath = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, sourcePackagePath), miniappComponentPath + '.json'));
        checkUsingComponents(dependencies, originalComponentConfigPath, distComponentConfigPath, sourceNativeMiniappScriptFile, npmName);
      }
      if (isThirdMiniappComponent) {
        const source = dirname(this.resourcePath);
        const target = dirname(normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, this.resourcePath))));
        outputDir(source, target);
        outputFile(rawContent, {});

        const originalComponentConfigPath = removeExt(this.resourcePath) + '.json';
        const distComponentConfigPath = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, removeExt(this.resourcePath) + '.json')));
        checkUsingComponents(dependencies, originalComponentConfigPath, distComponentConfigPath, this.resourcePath, npmName);
      }

      return [
        `/* Generated by JSX2MP ScriptLoader, sourceFile: ${this.resourcePath}. */`,
        generateDependencies(dependencies),
        content
      ].join('\n');
    } else {
      outputFile(rawContent, {
        isJSON: isJSONFile(this.resourcePath)
      });
    }
  } else {
    !isAppJSon && outputFile(rawContent, {
      isFromNpm: false,
      isJSON: isJSONFile(this.resourcePath)
    });
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
  const relativePathArray = relative(root, current).split(sep);
  let index = root;
  const result = [];
  while (index !== current) {
    const ifNodeModules = join(index, 'node_modules');
    if (existsSync(ifNodeModules)) {
      result.push(ifNodeModules);
    }
    index = join(index, relativePathArray.shift());
  }
  return result;
}

function generateDependencies(dependencies) {
  return dependencies
    .map(({ name, loader, options }) => {
      let mod = name;
      if (loader) mod = loader + '?' + JSON.stringify(options) + '!' + mod;
      return createImportStatement(mod);
    })
    .join('\n');
}

function createImportStatement(req) {
  return `import '${doubleBackslash(req)}';`;
}
