const vueCompiler = require('vue-template-compiler');
const genTpl = require('./genTpl');

/**
 * template transpile from vue to axml
 */
module.exports = function transpile(tpl = '', opts = {}) {
  const { ast } = vueCompiler.compile(tpl);

  const { metadata, template } = genTpl(ast, opts);
  return {
    template,
    metadata,
    ast
  };
};
