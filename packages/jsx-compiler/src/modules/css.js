const { readFileSync } = require('fs-extra');
const moduleResolve = require('../utils/moduleResolve');

/**
 * Add and convert style file to result.
 * 1. convert `rem` directly to `rpx`
 * 2. add `style` to result object.
 */
module.exports = {
  parse(parsed, code, options) {
    const { imported } = parsed;
    parsed.cssFiles = parsed.cssFiles || [];

    Object.keys(imported).forEach((rawPath) => {
      if (isFilenameCSS(rawPath)) {
        const resolvedPath = moduleResolve(options.cwd + '/index.jsx', rawPath);
        if (resolvedPath) {
          parsed.cssFiles.push({
            rawPath,
            filename: resolvedPath,
            content: readFileSync(resolvedPath, 'utf-8'),
          });
        }
      }
    });
  },
  generate(ret, parsed, options) {
    ret.style = ret.style || '';
    if (parsed.cssFiles) {
      parsed.cssFiles.forEach((cssFile) => {
        ret.style += convertCSSUnit(cssFile.content);
      });
    }
  },
};

function isFilenameCSS(path) {
  return /\.css$/i.test(path);
}

function convertCSSUnit(raw, originExt = 'rem', targetExt = 'rpx') {
  const regexp = new RegExp(originExt, 'g');
  return raw.replace(regexp, targetExt); // Maybe could use postcss plugin instead.
}
