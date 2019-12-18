const { readJSONSync, writeJSONSync, writeFileSync, readFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { relative, join, dirname, resolve } = require('path');
const { getOptions } = require('loader-utils');
const compiler = require('jsx-compiler');
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const cached = require('./cached');
const { removeExt, isFromTargetDirs } = require('./utils/pathHelper');
const eliminateDeadCode = require('./utils/dce');
const processCSS = require('./styleProcessor');
const output = require('./output');

const ComponentLoader = require.resolve('./component-loader');
const ScriptLoader = require.resolve('./script-loader');

const pe = new PrettyError();

module.exports = async function pageLoader(content) {
  const loaderOptions = getOptions(this);
  const { platform, entryPath, mode, disableCopyNpm, constantDir, turnOffSourceMap, pageConfig = {} } = loaderOptions;
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const resourcePath = this.resourcePath;
  const rootContext = this.rootContext;
  const absoluteConstantDir = constantDir.map(dir => join(rootContext, dir));

  const outputPath = this._compiler.outputPath;
  const sourcePath = join(rootContext, dirname(entryPath));
  const relativeSourcePath = relative(sourcePath, this.resourcePath);
  const targetFilePath = join(outputPath, relativeSourcePath);

  const isFromConstantDir = cached(isFromTargetDirs(absoluteConstantDir));

  const compilerOptions = Object.assign({}, compiler.baseOptions, {
    resourcePath: this.resourcePath,
    outputPath,
    sourcePath,
    type: 'page',
    platform,
    sourceFileName: this.resourcePath,
    disableCopyNpm,
    turnOffSourceMap
  });

  const rawContentAfterDCE = eliminateDeadCode(rawContent);

  let transformed;
  try {
    transformed = compiler(rawContentAfterDCE, compilerOptions);
  } catch (e) {
    console.log(chalk.red(`\n[${platform.name}] Error occured when handling Page ${this.resourcePath}`));
    console.log(pe.render(e));
    return '';
  }

  const { style, assets } = await processCSS(transformed.cssFiles, sourcePath);
  transformed.style = style;
  transformed.assets = assets;

  const pageDistDir = dirname(targetFilePath);
  if (!existsSync(pageDistDir)) mkdirpSync(pageDistDir);

  const distFileWithoutExt = removeExt(join(outputPath, relativeSourcePath));

  const config = Object.assign(pageConfig, transformed.config);
  if (Array.isArray(transformed.dependencies)) {
    transformed.dependencies.forEach(dep => {
      this.addDependency(dep);
    });
  }

  if (config.usingComponents) {
    const usingComponents = {};
    Object.keys(config.usingComponents).forEach(key => {
      const value = config.usingComponents[key];
      if (/^c-/.test(key)) {
        let result = './' + relative(dirname(this.resourcePath), value); // components/Repo.jsx
        result = removeExt(result); // components/Repo
        usingComponents[key] = result;
      } else {
        usingComponents[key] = value;
      }
    });
    config.usingComponents = usingComponents;
  }

  const outputContent = {
    code: transformed.code,
    map: transformed.map,
    css: transformed.style || '',
    json: config,
    template: transformed.template,
    assets: transformed.assets
  };
  const outputOption = {
    outputPath: {
      code: distFileWithoutExt + '.js',
      json: distFileWithoutExt + '.json',
      css: distFileWithoutExt + platform.extension.css,
      template: distFileWithoutExt + platform.extension.xml,
      assets: outputPath
    },
    mode
  };

  output(outputContent, rawContent, outputOption);

  function isCustomComponent(name, usingComponents = {}) {
    const matchingPath = join(dirname(resourcePath), name);
    for (let key in usingComponents) {
      if (usingComponents.hasOwnProperty(key)
          && usingComponents[key].indexOf(matchingPath) === 0) {
        return true;
      }
    }
    return false;
  }

  const dependencies = [];
  Object.keys(transformed.imported).forEach(name => {
    if (isCustomComponent(name, transformed.usingComponents)) {
      const componentPath = resolve(dirname(resourcePath), name);
      dependencies.push({
        name,
        loader: isFromConstantDir(componentPath) ? ScriptLoader : ComponentLoader, // Native miniapp component js file will be loaded by script-loader
        options: loaderOptions
      });
    } else {
      const importedArray = transformed.imported[name];
      let entirePush = false;
      importedArray.forEach(importedContent => {
        // Component library
        if (importedContent.isFromComponentLibrary) {
          dependencies.push({
            name,
            loader: ScriptLoader,
            options: Object.assign({}, loaderOptions, {
              importedComponent: importedContent.local
            })
          });
        } else {
          if (!entirePush) {
            dependencies.push({ name });
            entirePush = true;
          }
        }
      });
    }
  });

  return [
    `/* Generated by JSX2MP PageLoader, sourceFile: ${this.resourcePath}. */`,
    generateDependencies(dependencies, loaderOptions),
  ].join('\n');
};

function createImportStatement(req) {
  return `import '${req}';`;
}

function generateDependencies(dependencies, loaderOptions) {
  let loaderParams = loaderOptions ? JSON.stringify(loaderOptions) : '{}';
  return dependencies
    .map(({ name, loader, options }) => {
      let mod = name;
      if (loader) mod = loader + '?' + JSON.stringify(options) + '!' + mod;
      return createImportStatement(mod);
    })
    .join('\n');
}

