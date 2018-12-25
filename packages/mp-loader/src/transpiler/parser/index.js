const { parse, baseOptions } = require('sfc-compiler');
const modules = require('../transpileModules');

exports.parse = function(ast, opt) {
  const options = Object.assign({}, baseOptions, { modules }, opt);
  return parse(ast, options);
};
