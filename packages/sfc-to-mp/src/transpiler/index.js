const parse = require('./parse');
const generate = require('./generate');

/**
 * template transpile from sfc to mp
 */
module.exports = function transpile(content = '', opts = {}) {
  const { ast } = parse(content);
  const { metadata, template } = generate(ast, opts);
  return {
    template,
    metadata,
    ast,
  };
};
