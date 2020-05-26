const t = require('@babel/types');
const { readFileSync } = require('fs-extra');
const { moduleResolve } = require('../utils/moduleResolve');
const traverse = require('../utils/traverseNodePath');

/**
 * Add and convert style file to result.
 * 1. convert `rem` directly to `rpx`
 * 2. if named imported:
 *    import styles from './style.css';
 *    ->
 *    Transform and generate style.css to style.css.js
 * 3. if anoymous imported
 *    import './style.css';
 *    ->
 *    Transform rpx and generate same name css files.
 * ---
 */
module.exports = {
  parse(parsed, code, options) {
    const { imported } = parsed;
    const cssFileMap = {};
    parsed.cssFiles = parsed.cssFiles || [];

    Object.keys(imported).forEach(rawPath => {
      if (isFilenameCSS(rawPath)) {
        const resolvedPath = moduleResolve(options.resourcePath, rawPath);
        if (resolvedPath) {
          const isAnomyousImport = imported[rawPath].length === 0;
          parsed.cssFiles.push({
            rawPath,
            filename: resolvedPath,
            content: readFileSync(resolvedPath, 'utf-8'),
            type: isAnomyousImport ? 'cssFile' : 'cssObject',
          });
          if (isAnomyousImport) cssFileMap[rawPath] = true; // For removing import statement.
        }
      }
    });

    // Remove import css declaration
    traverse(parsed.ast, {
      ImportDeclaration(path) {
        const { node } = path;
        if (t.isStringLiteral(node.source) && cssFileMap[node.source.value.replace(/\\/g, '/')]) {
          path.remove();
        }
      }
    });
  },
  generate(ret, parsed, options) {
    ret.cssFiles = parsed.cssFiles;
    ret.dependencies = ret.dependencies || [];
    if (parsed.cssFiles) {
      parsed.cssFiles.forEach((cssFile) => {
        ret.dependencies.push(cssFile.filename);
      });
    }
  }
};

function isFilenameCSS(path) {
  return /\.(css|sass|less|scss|styl)$/i.test(path);
}
