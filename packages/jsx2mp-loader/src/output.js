const { writeJSONSync, writeFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { extname, dirname, join } = require('path');
const { transformSync } = require('@babel/core');
const { minify, minifyJS, minifyCSS, minifyXML } = require('./utils/minifyCode');
const addSourceMap = require('./utils/addSourceMap');

function transformCode(rawContent, mode, externalPlugins = [], externalPreset = []) {
  const presets = [].concat(externalPreset);
  const plugins = externalPlugins.concat([
    require('@babel/plugin-proposal-export-default-from'), // for support of export default
    [
      require('babel-plugin-transform-define'),
      {
        'process.env.NODE_ENV': mode === 'build' ? 'production' : 'development',
      }
    ],
    [
      require('babel-plugin-minify-dead-code-elimination'),
      {
        optimizeRawSize: true,
        keepFnName: true
      }
    ],
  ]);


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

  return transformSync(rawContent, {
    presets,
    plugins,
    parserOpts: babelParserOption
  });
}

/**
 * Process and write file
 * @param {object} content Compiled result
 * @param {string} raw Original file content
 * @param {object} options
 */
function output(content, raw, options) {
  const { mode, outputPath, externalPlugins = [] } = options;
  let { code, config, json, css, map, template, assets } = content;
  if (mode === 'build') {
    // Compile ES6 => ES5 and minify code
    code = minifyJS(transformCode(code,
      mode,
      externalPlugins.concat([require('@babel/plugin-proposal-class-properties')]),
      [require('@babel/preset-env')]
    ).code);
    if (config) {
      // Compile ES6 => ES5 and minify code
      config = minifyJS(transformCode(config,
        mode,
        externalPlugins.concat([require('@babel/plugin-proposal-class-properties')]),
        [require('@babel/preset-env')]
      ).code);
    }
    if (css) {
      css = minifyCSS(css);
    }
    if (template) {
      template = minifyXML(template);
    }
  } else {
    code = transformCode(code, mode, externalPlugins).code;
    // Add source map
    if (map) {
      code = addSourceMap(code, raw, map);
    }
  }

  // Write file
  writeFileWithDirCheck(outputPath.code, code);

  if (json) {
    writeFileWithDirCheck(outputPath.json, json, 'json');
  }
  if (template) {
    writeFileWithDirCheck(outputPath.template, template);
  }
  if (css) {
    writeFileWithDirCheck(outputPath.css, css);
  }
  if (config) {
    writeFileWithDirCheck(outputPath.config, config);
  }

  // Write extra assets
  if (assets) {
    Object.keys(assets).forEach((asset) => {
      const ext = extname(asset);
      let content = assets[asset];
      if (mode === 'build') {
        content = minify(content, ext);
      }
      const assetsOutputPath = join(outputPath.assets, asset);
      writeFileWithDirCheck(assetsOutputPath, content);
    });
  }
}


/**
 * mkdir before write file if dir does not exist
 * @param {string} filePath
 * @param {string|Buffer|TypedArray|DataView} content
 * @param {string}  [type=file] 'file' or 'json'
 */
function writeFileWithDirCheck(filePath, content, type = 'file') {
  const dirPath = dirname(filePath);
  if (!existsSync(dirPath)) {
    mkdirpSync(dirPath);
  }
  if (type === 'file') {
    writeFileSync(filePath, content);
  } else if (type === 'json') {
    writeJSONSync(filePath, content, { spaces: 2 });
  }
}

module.exports = output;
