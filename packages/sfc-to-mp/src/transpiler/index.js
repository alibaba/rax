const parse = require('./parse');
const generate = require('./generate');
const modules = require('./modules');

const baseOptions = {
  modules,
};

/**
 * template transpile from sfc to mp
 */
module.exports = function transpile(content = '', opts = {}) {
  console.log(opts);
  opts = Object.assign({}, baseOptions, opts);
  const { ast } = parse(content, opts);
  const { metadata, template } = generate(ast, opts);
  return {
    template,
    metadata,
    ast,
  };
};
