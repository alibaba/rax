const { parse } = require('sfc-loader/compiler/parser');
const modules = require('../transpile');
const baseOptions = require('./baseOptions');

exports.parse = function (ast, opt) {
  const options = Object.assign({}, baseOptions, { modules }, opt);
  return parse(ast, options);
};
