const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const getCompiledComponents = require('../getCompiledComponents');
const DynamicBinding = require('../utils/DynamicBinding');
const handleRefAttr = require('../utils/handleRefAttr');
const isNativeComponent = require('../utils/isNativeComponent');

function transformAttribute(ast, code, adapter) {
  const refs = [];
  const dynamicRef = new DynamicBinding(adapter.singleFileComponent ? 'r' : '_r');
  traverse(ast, {
    JSXAttribute(path) {
      const { node, parentPath } = path;
      const attrName = node.name.name;
      switch (attrName) {
        case 'key':
          node.name.name = adapter.key;
          if (adapter.needTransformKey && node.value.__originalExpression) {
            // In wechat miniprogram, key should be a string
            const originalExpression = node.value.__originalExpression;
            if (t.isIdentifier(originalExpression)) {
              node.value = t.stringLiteral(originalExpression.name);
            } else if (t.isMemberExpression(originalExpression)) {
              const propertyName = originalExpression.property.name;
              node.value = t.isStringLiteral(propertyName) ? propertyName : t.stringLiteral(propertyName);
            }
          }
          break;
        case 'className':
          if (!adapter.styleKeyword) {
            if (isNativeComponent(path, adapter.platform)) {
              node.name.name = 'class';
            } else {
              // Object.assign for shallow copy, avoid self tag is same reference
              path.parentPath.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('class'),
                Object.assign({}, node.value)));
            }
          } else {
            if (isNativeComponent(path, adapter.platform) || adapter.singleFileComponent) {
              node.name.name = 'class';
            }
          }
          break;
        case 'id':
          if (adapter.styleKeyword) {
            if (!isNativeComponent(path, adapter.platform)) {
              // Object.assign for shallow copy, avoid self tag is same reference
              path.parentPath.node.attributes.push(t.jsxAttribute(t.jsxIdentifier('componentId'),
                Object.assign({}, node.value)));
            }
          }
          break;
        case 'style':
          if (adapter.styleKeyword && !isNativeComponent(path, adapter.platform)) {
            if (adapter.singleFileComponent && parentPath.node.isCustomEl) {
              node.name.name = 'style-sheet';
            } else {
              node.name.name = 'styleSheet';
            }
          }
          break;
        case 'ref':
          if (t.isJSXExpressionContainer(node.value) && !t.isStringLiteral(node.value.expression)) {
            if (adapter.singleFileComponent) {
              // node.value = t.stringLiteral(genExpression(node.value.expression));
              node.name.name = 'id';
              // break;
            }
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
            refs.push(handleRefAttr(path, childExpression, node.value, adapter));
          } else {
            throw new CodeError(code, node, path.loc, "Ref's type must be JSXExpressionContainer, like <View ref = { scrollRef }/>");
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

module.exports = {
  parse(parsed, code, options) {
    const { refs, dynamicRef } = transformAttribute(parsed.templateAST, code, options.adapter);
    parsed.refs = refs;
    // Set global dynamic ref value
    parsed.dynamicRef = dynamicRef;
  },
  // For test cases.
  _transformAttribute: transformAttribute
};
