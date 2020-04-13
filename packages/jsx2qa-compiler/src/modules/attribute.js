const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const CodeError = require('../utils/CodeError');
const getCompiledComponents = require('../getCompiledComponents');
const DynamicBinding = require('../utils/DynamicBinding');
const generateId = require('../utils/generateId');

function transformAttribute(ast, code, adapter) {
  const refs = [];
  const dynamicRef = new DynamicBinding('r');
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
            if (isNativeComponent(path, adapter.platform)) {
              node.name.name = 'class';
            }
          }
          break;
        case 'style':
          if (adapter.styleKeyword && !isNativeComponent(path, adapter.platform)) {
            if (parentPath.node.isCustomEl) {
              node.name.name = 'style-sheet';
            } else {
              node.name.name = 'styleSheet';
            }
          }
          break;
        case 'ref':
          if (t.isJSXExpressionContainer(node.value) && !t.isStringLiteral(node.value.expression)) {
            node.name.name = 'id';
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
            const refInfo = {
              name: node.value,
              method: childExpression
            };
            const attributes = path.parent.attributes;
            const componentNameNode = path.parent.name;
            if (t.isJSXIdentifier(componentNameNode)) {
              if (componentNameNode.isCustom && !isNativeComponent(path, adapter.platform)) {
                refInfo.type = t.stringLiteral('component');
                insertBindComRef(attributes, childExpression, node.value, adapter.triggerRef);
              } else {
                refInfo.type = t.stringLiteral('native');
              }
            } else {
              refInfo.type = t.stringLiteral('component');
              insertBindComRef(attributes, childExpression, node.value, adapter.triggerRef);
            }
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

function isNativeComponent(path, platform) {
  const {
    node: { name: tagName }
  } = path.parentPath.get('name');
  return !!getCompiledComponents(platform)[tagName];
}

function insertBindComRef(attributes, childExpression, ref, triggerRef) {
  // Inset setCompRef
  // <Child bindComRef={fn} /> in MiniApp
  // <Child bindComRef="scrollRef" /> in WechatMiniProgram
  attributes.push(
    t.jsxAttribute(t.jsxIdentifier('bindComRef'),
      triggerRef ? ref :
        t.jsxExpressionContainer(
          childExpression
        ))
  );
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
