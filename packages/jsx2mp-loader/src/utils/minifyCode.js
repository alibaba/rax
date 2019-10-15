const terser = require('terser');
const csso = require('csso');

function minifyJS(source) {
  const result = terser.minify(source);
  if (result.error) {
    // TODO:
  }

  return result.code;
}

function minifyCSS(source) {
  return csso.minify(source, {
    restructure: false
  }).css;
}

function minify(source, type = '.js') {
  if (type === '.js') {
    return minifyJS(source);
  }
  if (type === '.css') {
    return minifyCSS(source);
  }

  return source;
}

module.exports = {
  minify,
  minifyJS,
  minifyCSS
}
