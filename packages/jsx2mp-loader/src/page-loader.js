const { readJSONSync, writeJSONSync, writeFileSync, readFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { relative, join, dirname, extname } = require('path');
const { getOptions } = require('loader-utils');
const compiler = require('jsx-compiler');
const { removeExt } = require('./utils/pathHelper');
const eliminateDeadCode = require('./utils/dce');
const output = require('./output');

const ComponentLoader = require.resolve('./component-loader');

module.exports = function pageLoader(content) {
  const loaderOptions = getOptions(this);
  const { platform, entryPath, mode } = loaderOptions;
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const resourcePath = this.resourcePath;

  const outputPath = this._compiler.outputPath;
  const sourcePath = join(this.rootContext, dirname(entryPath));
  const relativeSourcePath = relative(sourcePath, this.resourcePath);
  const targetFilePath = join(outputPath, relativeSourcePath);

  const compilerOptions = Object.assign({}, compiler.baseOptions, {
    resourcePath: this.resourcePath,
    outputPath,
    sourcePath,
    type: 'page',
    platform,
    sourceFileName: this.resourcePath
  });

  const rawContentAfterDCE = eliminateDeadCode(rawContent);
  const transformed = compiler(rawContentAfterDCE, compilerOptions);
  const pageDistDir = dirname(targetFilePath);
  if (!existsSync(pageDistDir)) mkdirpSync(pageDistDir);

  const distFileWithoutExt = removeExt(join(outputPath, relativeSourcePath));

  const config = Object.assign({}, transformed.config);
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

  const denpendencies = [];
  Object.keys(transformed.imported).forEach(name => {
    if (isCustomComponent(name, transformed.usingComponents)) {
      denpendencies.push({ name, loader: ComponentLoader, options: { entryPath: loaderOptions.entryPath, platform: loaderOptions.platform, constantDir: loaderOptions.constantDir, mode: loaderOptions.mode } });
    } else {
      denpendencies.push({ name });
    }
  });

  return [
    `/* Generated by JSX2MP PageLoader, sourceFile: ${this.resourcePath}. */`,
    generateDependencies(denpendencies, loaderOptions),
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

