/**************************************************
 * Created by kaili on 2019/5/16 下午5:26.
 **************************************************/
const renderBuilder = require('../render-base/render-builder');
const chalk = require('chalk');
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
    console.log(chalk.cyanBright(code));
  }
});
