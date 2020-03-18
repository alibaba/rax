const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');

function transformAlias(ast, aliasEntries) {
  if (aliasEntries) {
    traverse(ast, {
      ImportDeclaration(path) {
        const { value } = path.node.source;
        if (aliasEntries[value]) {
          path.node.source = t.stringLiteral(aliasEntries[value]);
        }
      },
      CallExpression(path) {
        const { node } = path;
        if (
          node.callee.name === 'require' &&
              node.arguments &&
              node.arguments.length === 1 &&
              t.isStringLiteral(node.arguments[0])
        ) {
          const moduleName = node.arguments[0].value;
          if (aliasEntries[moduleName]) {
            path.node.arguments = [
              t.stringLiteral(aliasEntries[moduleName])
            ];
          }
        }
      }
    });
  }
}

module.exports = {
  parse(parsed, code, options) {
    transformAlias(parsed.ast, options.aliasEntries);
  },

  // For test cases.
  _transformAlias: transformAlias,
};
