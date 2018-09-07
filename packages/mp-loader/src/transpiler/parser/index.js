const { parse } = require('sfc-compiler');
const modules = require('../transpileModules');

exports.parse = function(ast, opt) {
  const options = Object.assign({}, { modules }, opt);
  return parse(ast, options);
};
