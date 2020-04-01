const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const { isWeexModule } = require('../utils/checkModule');

function transformFunction(ast) {
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      if (node.callee.name === 'require' &&
        node.arguments &&
        node.arguments.length === 1 &&
      t.isStringLiteral(node.arguments[0])) {
        const moduleName = node.arguments[0].value;
        if (isWeexModule(moduleName)) {
          path.replaceWith(t.nullLiteral());
        }
      }
    }
  });
}

module.exports = {
  parse(parsed, code, options) {
    transformFunction(parsed.ast);
  },

  // For test cases.
  _transformFunction: transformFunction,
};
