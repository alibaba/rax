const { parse, baseOptions } = require('sfc-compiler');

module.exports = function(modules) {
  return function(ast, opt) {
    const options = Object.assign({}, baseOptions, { modules }, opt);
    return parse(ast, options);
  };
};
