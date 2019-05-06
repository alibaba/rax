const { readFileSync } = require('fs-extra');
const moduleResolve = require('../utils/moduleResolve');

/**
 * Add style result for result.
 */
module.exports = {
  parse(parsed, code, options) {
    const { imported } = parsed;
    parsed.css = '';
    Object.keys(imported).forEach((rawPath) => {
      if (isCSS(rawPath)) {
        const resolvedPath = moduleResolve(options.cwd + '/index.jsx', rawPath);
        if (resolvedPath) {
          parsed.css += readFileSync(resolvedPath, 'utf-8');
        }
      }
    })
  },
  generate(ret, parsed, options) {
    if (parsed.css) {
      ret.style = /* TODO: preprocessors */ parsed.css;
    }
  },
};

function isCSS(path) {
  return /\.css$/i.test(path);
}
