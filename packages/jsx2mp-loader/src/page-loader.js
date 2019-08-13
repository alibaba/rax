const { readJSONSync, writeJSONSync, writeFileSync, readFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { relative, join, dirname } = require('path');
const { getOptions } = require('loader-utils');
const compiler = require('jsx-compiler');
const { removeExt } = require('./utils');

const ComponentLoader = require.resolve('./component-loader');

module.exports = function pageLoader(content) {
  const loaderOptions = getOptions(this);
  const { platform } = loaderOptions;
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const resourcePath = this.resourcePath;
  const rootContext = this.rootContext;

  const distPath = this._compiler.outputPath;
  const relativeSourcePath = relative(join(this.rootContext, dirname(loaderOptions.entryPath)), this.resourcePath);
  const targetFilePath = join(distPath, relativeSourcePath);

  const compilerOptions = Object.assign({}, compiler.baseOptions, {
    filePath: this.resourcePath,
    distPath,
    targetFileDir: dirname(targetFilePath),
    type: 'page',
    platform
  });


  const transformed = compiler(rawContent, compilerOptions);
  const pageDistDir = dirname(targetFilePath);
  if (!existsSync(pageDistDir)) mkdirpSync(pageDistDir);

  const distFileWithoutExt = removeExt(join(distPath, relativeSourcePath));

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
        let result = './' + relative(dirname(this.resourcePath) ,value); // components/Repo.jsx
        result = removeExt(result); // components/Repo
        usingComponents[key] = result;
      } else {
        usingComponents[key] = value;
      }
    });
    config.usingComponents = usingComponents;
  }

  // Write js content
  writeFileSync(distFileWithoutExt + '.js', transformed.code);
  // Write template
  writeFileSync(distFileWithoutExt + '.' + platform.extension.xml, transformed.template);
  // Write config
  writeJSONSync(distFileWithoutExt + '.json', config, { spaces: 2 });
  // Write acss style
  if (transformed.style) {
    writeFileSync(distFileWithoutExt + '.' + platform.extension.css, transformed.style);
  }
  // Write extra assets
  if (transformed.assets) {
    Object.keys(transformed.assets).forEach((asset) => {
      const content = transformed.assets[asset];
      const assetDirectory = dirname(join(distPath, asset));
      if (!existsSync(assetDirectory)) mkdirpSync(assetDirectory);
      writeFileSync(join(distPath, asset), content);
    });
  }

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
      denpendencies.push({ name, loader: ComponentLoader, options: { entryPath: loaderOptions.entryPath , platform: loaderOptions.platform } });
    } else {
      denpendencies.push({ name });
    }
  });

  return [
    `/* Generated by JSX2MP PageLoader, sourceFile: ${this.resourcePath}. */`,
    generateDependencies(denpendencies),
  ].join('\n');
};

function createImportStatement(req) {
  return `import '${req}';`;
}

function generateDependencies(dependencies) {
  return dependencies
    .map(({ name, loader, options }) => {
      let mod = name;
      if (loader) mod = loader + '?' + JSON.stringify(options) +  '!' + mod;
      return createImportStatement(mod);
    })
    .join('\n');
}

