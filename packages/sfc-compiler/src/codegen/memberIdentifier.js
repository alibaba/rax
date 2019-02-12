const { isPreveredIdentifier, isPreveredGlobalObject, no } = require('../utils');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const {
  memberExpression,
  identifier,
  isIdentifier,
  isObjectProperty,
  isNumericLiteral,
  isStringLiteral,
  isMemberExpression
} = require('babel-types');

/**
 * Make an ES identifier to be a member of some object.
 * @param code {String} Raw JS code.
 * @param shouldSkip {Function} Judge should skip member.
 * @param prefixIdentifier {String} Prefix string.
 * @return {String} Transformed code.
 */
module.exports = function(code, shouldSkip = no, prefixIdentifier = 'this') {
  const ast = babylon.parse(code);
  const prefix = identifier(prefixIdentifier);

  const visitor = {
    MemberExpression(path) {
      const { node } = path;
      if (node.done) return;

      if (shouldSkip(node.object.name)) {
        node.object.done = true;
        return;
      }

      if (
        isIdentifier(node.object) &&
        !isPreveredIdentifier(node.object.name) &&
        !isPreveredGlobalObject(node.object.name) &&
        (isIdentifier(node.property) || isLiteral(node.property))
      ) {
        node.object = memberExpression(prefix, node.object);
        node.object.done = true;
      }
    },

    Identifier(path) {
      const { node } = path;

      // Skip if not a root of member expression.
      if (path.findParent(path => isMemberExpression(path.node))) return;

      // Manually skip.
      if (shouldSkip(node.name)) return;
      if (isObjectProperty(path.parent)) return;
      if (isPreveredIdentifier(node.name)) return;
      if (isPreveredGlobalObject(node.name)) return;

      if (!node.done) {
        node.done = true;
        const replacement = memberExpression(prefix, node);
        replacement.done = true;
        path.replaceWith(replacement);
      }
    }
  };

  traverse(ast, visitor);

  return generate(ast).code;
};

function isLiteral(node) {
  return isNumericLiteral(node) || isStringLiteral(node);
}
