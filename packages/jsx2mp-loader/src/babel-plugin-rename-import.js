const { join } = require('path');

const WEEX_MODULE_REG = /^@weex\//;

function isNpmModule(value) {
  return !(value[0] === '.' || value[0] === '/');
}

function isWeexModule(value) {
  return WEEX_MODULE_REG.test(value);
}

module.exports = function visitor({ types: t }) {
  const source = (value, prefix) => t.stringLiteral(join(prefix, value));
  return {
    visitor: {
      ImportDeclaration(path, state) {
        const { npmRelativePath } = state.opts;
        const { value } = path.node.source;
        if (isWeexModule(value)) {
          path.remove();
        } else if (isNpmModule(value)) {
          path.node.source = source(value, npmRelativePath);
        }
      },

      CallExpression(path, state) {
        const { npmRelativePath } = state.opts;
        const { node } = path;
        if (
          node.callee.name === 'require' &&
          node.arguments &&
          node.arguments.length === 1 &&
          t.isStringLiteral(node.arguments[0])
        ) {
          if (isWeexModule()) {
            path.replaceWith(t.nullLiteral);
          } else if (isNpmModule(node.arguments[0].value)) {
            path.node.arguments = [
              source(node.arguments[0].value, npmRelativePath)
            ];
          }
        }
      }
    }
  };
};
