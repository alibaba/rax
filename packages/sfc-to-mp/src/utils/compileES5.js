const getBabelOptions = require('./getBabelOptions');
const { transformSync } = require('@babel/core');

module.exports = function compileES5(str, opts) {
  try {
    const { code, map, ast } = transformSync(
      str,
      Object.assign({}, getBabelOptions(), opts)
    );
    return { code, map, ast };
  } catch (err) {
    console.log(111, str, opts, err);
  }
};
