const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const baseComponents = require('../baseComponents');

function transformAttribute(ast, code, adapter) {
  const refs = [];
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      const attrName = node.name.name;
      switch (attrName) {
        case 'key':
          node.name.name = adapter.key;
          break;
        case 'className':
          if (!adapter.styleKeyword || isNativeComponent(path)) {
            node.name.name = 'class';
          }
          break;
        case 'style':
          if (adapter.styleKeyword && !isNativeComponent(path)) {
            node.name.name = 'styleSheet';
          }
          break;
        case 'ref':
          if (t.isJSXExpressionContainer(node.value)) {
            node.value = t.stringLiteral(genExpression(node.value.expression));
          }
          if (t.isStringLiteral(node.value)) {
            refs.push(node.value);
          } else {
            throw new CodeError(code, node, path.loc, "Ref's type must be string or jsxExpressionContainer");
          }
          break;
        default:
          path.stop();
      }
    }
  });
  return refs;
}

function isNativeComponent(path) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return baseComponents[tagName];
}

module.exports = {
  parse(parsed, code, options) {
    parsed.refs = transformAttribute(parsed.templateAST, code, options.adapter);
  },

  // For test cases.
  _transformAttribute: transformAttribute,
};
