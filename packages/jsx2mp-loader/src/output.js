const { writeJSONSync, writeFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { extname, dirname, join } = require('path');
const { transformSync } = require('@babel/core');
const { minify, minifyJS, minifyCSS, minifyXML } = require('./utils/minifyCode');
const addSourceMap = require('./utils/addSourceMap');

function transformCode(rawContent, mode, externalPlugins = [], externalPreset = []) {
  const presets = [].concat(externalPreset);
  const plugins = externalPlugins.concat([
    require('@babel/plugin-proposal-export-default-from'), // for support of export defualt
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
  writeFileSync(outputPath.code, code);
  if (json) {
    if (existsSync(outputPath.srcJson)) {
      json = Object.assign(require(outputPath.srcJson), json);
    }
    writeJSONSync(outputPath.json, json, { spaces: 2});
  }
  if (template) {
    writeFileSync(outputPath.template, template);
  }
  if (css) {
    writeFileSync(outputPath.css, css);
  }
  if (config) {
    writeFileSync(outputPath.config, config);
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
      const assetDirectory = dirname(assetsOutputPath);
      if (!existsSync(assetDirectory)) {
        mkdirpSync(assetDirectory);
      }
      writeFileSync(assetsOutputPath, content);
    });
  }
}

module.exports = output;
