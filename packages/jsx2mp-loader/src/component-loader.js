const { readFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { relative, join, dirname, sep, extname } = require('path');
const compiler = require('jsx-compiler');
const { getOptions } = require('loader-utils');
const chalk = require('chalk');
const PrettyError = require('pretty-error');
const pe = new PrettyError();
const cached = require('./cached');
const { removeExt } = require('./utils/pathHelper');
const eliminateDeadCode = require('./utils/dce');
const processCSS = require('./styleProcessor');
const output = require('./output');

const ComponentLoader = __filename;

module.exports = async function componentLoader(content) {
  const loaderOptions = getOptions(this);
  const { platform, entryPath, constantDir, mode, disableCopyNpm } = loaderOptions;
  const rawContent = readFileSync(this.resourcePath, 'utf-8');
  const resourcePath = this.resourcePath;

  const outputPath = this._compiler.outputPath;
  const sourcePath = join(this.rootContext, dirname(entryPath));
  const relativeSourcePath = relative(sourcePath, this.resourcePath);
  const distFileWithoutExt = removeExt(join(outputPath, relativeSourcePath));

  const isFromConstantDir = cached(function isFromConstantDir(dir) {
    return constantDir.some(singleDir => isChildOf(singleDir, dir));
  });

  if (isFromConstantDir(this.resourcePath)) {
    return '';
  }

  const compilerOptions = Object.assign({}, compiler.baseOptions, {
    resourcePath: this.resourcePath,
    outputPath,
    sourcePath,
    type: 'component',
    platform,
    sourceFileName: this.resourcePath,
    disableCopyNpm
  });

  const rawContentAfterDCE = eliminateDeadCode(rawContent);

  let transformed;
  try {
    transformed = compiler(rawContentAfterDCE, compilerOptions);
  } catch (e) {
    console.log(chalk.red(`\n[Miniapp ${platform.type}] Error occured when handling Component ${this.resourcePath}`));
    console.log(pe.render(e));
    return '';
  }

  const { style, assets } = await processCSS(transformed.cssFiles, sourcePath);
  transformed.style = style;
  transformed.assets = assets;

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
        let result = './' + relative(dirname(this.resourcePath), value); // ./components/Repo.jsx
        result = removeExt(result); // ./components/Repo

        usingComponents[key] = result;
      } else {
        usingComponents[key] = value;
      }
    });
    config.usingComponents = usingComponents;
  }

  const distFileDir = dirname(distFileWithoutExt);
  if (!existsSync(distFileDir)) mkdirpSync(distFileDir);

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
      if (
        usingComponents.hasOwnProperty(key)
        && usingComponents[key]
        && usingComponents[key].indexOf(matchingPath) === 0
      ) {
        return true;
      }
    }
    return false;
  }

  const denpendencies = [];
  Object.keys(transformed.imported).forEach(name => {
    if (isCustomComponent(name, transformed.usingComponents)) {
      denpendencies.push({
        name,
        loader: ComponentLoader,
        options: loaderOptions
      });
    } else {
      denpendencies.push({ name });
    }
  });

  return [
    `/* Generated by JSX2MP ComponentLoader, sourceFile: ${this.resourcePath}. */`,
    generateDependencies(denpendencies),
  ].join('\n');
};

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

/**
 * judge whether the child dir is part of parent dir
 * @param {string} child
 * @param {string} parent
 */
function isChildOf(child, parent) {
  const childArray = child.split(sep).filter(i => i.length);
  const parentArray = parent.split(sep).filter(i => i.length);
  const clen = childArray.length;
  const plen = parentArray.length;

  let j = 0;
  for (let i = 0; i < plen; i++) {
    if (parentArray[i] === childArray[j]) {
      j++;
    }
    if (j === clen) {
      return true;
    }
  }
  return false;
}
