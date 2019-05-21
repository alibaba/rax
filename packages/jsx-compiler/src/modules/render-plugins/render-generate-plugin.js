const renderBuilder = require('../render-base/render-builder');
const generate = require('@babel/generator').default;

const TEMPLATE_AST = 'templateAST';

module.exports = renderBuilder({
  name: 'render-generate-plugin',
  parse(parsed, renderAst, returnPath) {
    parsed[TEMPLATE_AST] = returnPath.node;
    returnPath.remove();
  },
  generate(ret, parsed, options) {
    let code = generate(parsed[TEMPLATE_AST]).code;
    code = code.replace(/(\{\{)\s*([\w\:\.]+\s*[\w\:\.]+)\s*(\}\})/g, '$1$2$3');
    code = code.replace(/___replace___:\s*/g, '');
    console.log(code)
  }
});
