const t = require('@babel/types');
const { readFileSync } = require('fs-extra');
const moduleResolve = require('../utils/moduleResolve');
const traverse = require('../utils/traverseNodePath');

/**
 * Add and convert style file to result.
 * 1. convert `rem` directly to `rpx`
 * 2. add `style` to result object.
 */
module.exports = {
  parse(parsed, code, options) {
    const { imported } = parsed;
    const cssFileMap = {};
    parsed.cssFiles = parsed.cssFiles || [];

    Object.keys(imported).forEach((rawPath) => {
      if (isFilenameCSS(rawPath)) {
        const resolvedPath = moduleResolve(options.filePath, rawPath);
        if (resolvedPath) {
          cssFileMap[rawPath] = true;
          parsed.cssFiles.push({
            rawPath,
            filename: resolvedPath,
            content: readFileSync(resolvedPath, 'utf-8'),
          });
        }
      }
    });

    // Remove import css declaration
    traverse(parsed.ast, {
      ImportDeclaration(path) {
        const { node } = path;
        if (t.isStringLiteral(node.source) && cssFileMap[node.source.value]) {
          path.remove();
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
