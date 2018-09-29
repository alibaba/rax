const { transformSync } = require('@babel/core');
const babelConfig = require('../config/babel.config');

module.exports = function compileES5(str, opts) {
  try {
    const { code, map, ast } = transformSync(
      str,
      Object.assign({}, babelConfig, opts)
    );
    return { code, map, ast };
  } catch (err) {
    console.log(111, str, opts, err);
  }
};
