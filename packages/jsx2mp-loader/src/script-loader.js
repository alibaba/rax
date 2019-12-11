const { join, dirname, relative, resolve, extname, sep } = require('path');
const { copySync, existsSync, mkdirpSync, writeJSONSync, statSync, readFileSync, readJSONSync } = require('fs-extra');
const { getOptions } = require('loader-utils');
const cached = require('./cached');
const { removeExt, isFromTargetDirs, replaceExtension } = require('./utils/pathHelper');
const { isNpmModule } = require('./utils/judgeModule');
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

    // Is miniapp compatible component.
    if (pkg.hasOwnProperty(MINIAPP_CONFIG_FIELD) && this.resourcePath === npmMainPath || isRelativeMiniappComponent) {
      const mainName = platform.type === 'ali' ? 'main' : `main:${platform.type}`;
      // Case 1: Single component except those old universal api with pkg.miniappConfig
      // Case 2: Component library which exports multiple components
      const isSingleComponent = !!pkg.miniappConfig[mainName];
      const isComponentLibrary = pkg.miniappConfig.subPackages && pkg.miniappConfig.subPackages[importedComponent];

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
        if (existsSync(source)) {
          const target = normalizeNpmFileName(join(outputPath, 'npm', relative(rootNodeModulePath, sourcePackagePath), miniappComponentDir));
          mkdirpSync(target);
          copySync(source, target, {
            overwrite: false,
            filter: filename => !/__(mocks|tests?)__/.test(filename)
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
                } else if (componentPath.indexOf('/npm/') === -1) { // Exclude the path that has been modified by jsx-compiler
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
          writeJSONSync(componentConfigPath, componentConfig);
        } else {
          this.emitWarning('Cannot found miniappConfig component for: ' + npmName);
        }
        return [
          `/* Generated by JSX2MP ScriptLoader, sourceFile: ${this.resourcePath}. */`,
          generateDependencies(dependencies),
          content
        ].join('\n');
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

    // If typescript
    if (extname(this.resourcePath) === '.ts') {
      outputOption.externalPlugins.unshift(require('@babel/plugin-transform-typescript'));
      outputOption.outputPath.code = replaceExtension(outputOption.outputPath.code, '.js');
    }
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
  return `import '${req}';`;
}
