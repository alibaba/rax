const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const compiledComponents = require('../getCompiledComponents');
const DynamicBinding = require('../utils/DynamicBinding');
const generateId = require('../utils/generateId');
const quickappConst = require('../const');

function transformAttribute(ast, code) {
  const refs = [];
  const dynamicRef = new DynamicBinding('r');
  traverse(ast, {
    JSXAttribute(path) {
      const { node, parentPath } = path;
      const attrName = node.name.name;
      switch (attrName) {
        case 'key':
          node.name.name = quickappConst.key;
          break;
        case 'className':
          node.name.name = 'class';
          break;
        case 'style':
          if (!isNativeComponent(path)) {
            node.name.name = 'styleSheet';
          }
          break;
        case 'ref':
          if (t.isJSXExpressionContainer(node.value) && !t.isStringLiteral(node.value.expression)) {
            node.name.name = 'id';
            const childExpression = node.value.expression;
            // For this.xxx = createRef();
            node.value = t.stringLiteral(genExpression(childExpression));
            const refInfo = {
              name: node.value,
              method: childExpression
            };
            const attributes = path.parent.attributes;
            const componentNameNode = path.parent.name;
            refInfo.type = t.stringLiteral('native');
            // Get all attributes
            let idAttr = attributes.find(attr => t.isJSXIdentifier(attr.name, { name: 'id' }));
            if (!idAttr) {
              // Insert progressive increase id
              idAttr = t.jsxAttribute(t.jsxIdentifier('id'), t.stringLiteral(generateId()));
              attributes.push(idAttr);
            }
            refInfo.id = idAttr.value;
            refs.push(refInfo);
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

function isNativeComponent(path) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return !!compiledComponents[tagName];
}

module.exports = {
  parse(parsed, code, options) {
    const { refs, dynamicRef } = transformAttribute(parsed.templateAST, code);
    parsed.refs = refs;
    // Set global dynamic ref value
    parsed.dynamicRef = dynamicRef;
  },
  // For test cases.
  _transformAttribute: transformAttribute
};
