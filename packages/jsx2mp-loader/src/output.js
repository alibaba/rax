const { writeJSONSync, writeFileSync, existsSync, mkdirpSync } = require('fs-extra');
const { extname, dirname, join } = require('path');
const { minify, minifyJS, minifyCSS, minifyXML } = require('./utils/minifyCode');
const addSourceMap = require('./utils/addSourceMap');

/**
 * Process and write file
 * @param {object} content Compiled result
 * @param {string} raw Original file content
 * @param {object} options
 */
function output(content, raw, options) {
  const { mode, outputPath } = options;
  let { code, config, json, css, map, template, assets } = content;
  if (mode === 'build') {
    // Minify code
    code = minifyJS(code);
    if (config) {
      config = minifyJS(config);
    }
    if (css) {
      css = minifyCSS(css);
    }
    if (template) {
      template = minifyXML(template);
    }
  } else {
    // Add source map
    if (map) {
      code = addSourceMap(code, raw, map);
    }
  }

  // Write file
  writeFileSync(outputPath.code, code);
  if (json) {
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
