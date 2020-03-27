const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');
const isQuickApp = require('../utils/isQuickApp');
const CodeError = require('../utils/CodeError');
const getCompiledComponents = require('../getCompiledComponents');
const DynamicBinding = require('../utils/DynamicBinding');
const handleRefAttr = require('../utils/handleRefAttr');

function transformAttribute(ast, code, adapter) {
  const quickApp = isQuickApp(adapter);
  const refs = [];
  const dynamicRef = new DynamicBinding(quickApp ? 'r' : '_r');
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
            if (quickApp) {
              node.name.name = 'class';
            } else if (isNativeComponent(path, adapter.platform)) {
              node.name.name = 'class';
            }
          }
          break;
        case 'style':
          if (adapter.styleKeyword && !isNativeComponent(path, adapter.platform)) {
            if (quickApp && /(c)?-/g.test(parentPath.node.name.name)) {
              node.name.name = 'style-sheet';
            } else {
              node.name.name = 'styleSheet';
            }
          }
          break;
        case 'ref':
          if (quickApp) {
            if (t.isJSXExpressionContainer(node.value)) {
              node.value = t.stringLiteral(genExpression(node.value.expression));
            }
            if (t.isStringLiteral(node.value)) {
              refs.push(node.value);
            } else {
              throw new CodeError(code, node, path.loc, "Ref's type must be string or jsxExpressionContainer");
            }
            node.name.name = 'id';
          } else {
            if (path.node.__transformed) return;
            if (t.isJSXExpressionContainer(node.value) && !t.isStringLiteral(node.value.expression)) {
              const childExpression = node.value.expression;
              // For this.xxx = createRef();
              if (t.isMemberExpression(childExpression)
                  && t.isThisExpression(childExpression.object)) {
                node.value = t.stringLiteral(dynamicRef.add({
                  expression: childExpression
                }));
              } else {
                throw new CodeError(code, node, path.loc, "Ref's type must be string or jsxExpressionContainer");
              }
              refs.push(handleRefAttr(path, childExpression, node.value, adapter));
            } else {
              throw new CodeError(code, node, node.loc, "Ref's type must be JSXExpressionContainer, like <View ref={ viewRef }/>");
            }
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

function transformPreComponentAttr(ast, options) {
  traverse(ast, {
    JSXAttribute(path) {
      const { node, parentPath } = path;
      const attrName = node.name.name;
      if (parentPath.node.name.name.indexOf('rax-') !== -1) {
        // origin components
        // onChange => bindChange
        if (attrName.slice(0, 2) === 'on') {
          node.name.name = attrName.replace('on', 'bind');
        }
        // bindChange => bind-change
        const newAttrName = node.name.name;
        if (/[A-Z]+/g.test(newAttrName) && newAttrName !== 'className') {
          node.name.name = newAttrName.replace(/[A-Z]+/g, (v, i) => {
            if (i !== 0) {
              return `-${v.toLowerCase()}`;
            }
            return v;
          });
        }
      }
      if (parentPath.node.name.name === 'div') {
        node.name.name = node.name.name.toLowerCase();
      }
    }
  });
}

module.exports = {
  parse(parsed, code, options) {
    const { refs, dynamicRef } = transformAttribute(parsed.templateAST, code, options.adapter);
    parsed.refs = refs;
    // Set global dynamic ref value
    parsed.dynamicRef = dynamicRef;
  },
  generate(ret, parsed, options) {
    if (!isQuickApp(options)) return;
    if (parsed.templateAST) {
      transformPreComponentAttr(parsed.templateAST, options.adapter);
    }
    ret.template = genExpression(parsed.templateAST, {
      comments: false,
      concise: true,
    });
  },
  // For test cases.
  _transformAttribute: transformAttribute,
  _transformPreComponentAttr: transformPreComponentAttr
};
