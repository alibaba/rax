const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const compiledComponents = require('../compiledComponents');
const DynamicBinding = require('../utils/DynamicBinding');

function transformAttribute(ast, code, adapter) {
  const refs = [];
  const dynamicRef = new DynamicBinding('_r');
  traverse(ast, {
    JSXAttribute(path) {
      const { node } = path;
      const attrName = node.name.name;
      switch (attrName) {
        case 'key':
          node.name.name = adapter.key;
          break;
        case 'className':
          if (!adapter.styleKeyword) {
            if (isNativeComponent(path)) {
              node.name.name = 'class';
            } else {
              // Object.assign for shallow copy, avoid self tag is same reference
              path.parentPath.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('class'),
                Object.assign({}, node.value)));
            }
          } else if (isNativeComponent(path)) {
            node.name.name = 'class';
          }
          break;
        case 'style':
          if (adapter.styleKeyword && !isNativeComponent(path)) {
            node.name.name = 'styleSheet';
          }
          break;
        case 'ref':
          switch (node.value.type) {
            case 'JSXExpressionContainer':
              const childExpression = node.value.expression;
              // For this.xxx = createRef();
              if (t.isMemberExpression(childExpression)
                && t.isThisExpression(childExpression.object)) {
                node.value = t.stringLiteral(dynamicRef.add({
                  expression: childExpression
                }));
              } else {
                node.value = t.stringLiteral(genExpression(childExpression));
              }
              refs.push({
                name: node.value,
                method: childExpression
              });
              break;
            case 'StringLiteral':
              refs.push({
                name: node.value,
                method: node.value
              });
              break;
            default:
              throw new CodeError(code, node, path.loc, "Ref's type must be string or jsxExpressionContainer");
          }
          break;
        default:
          path.skip();
      }
    }
  });
  return {
    refs,
    dynamicRef
  };
}

function isNativeComponent(path) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return !!compiledComponents[tagName];
}

module.exports = {
  parse(parsed, code, options) {
    const { refs, dynamicRef } = transformAttribute(parsed.templateAST, code, options.adapter);
    parsed.refs = refs;
    // Set global dynamic ref value
    parsed.dynamicRef = dynamicRef;
  },

  // For test cases.
  _transformAttribute: transformAttribute,
};
