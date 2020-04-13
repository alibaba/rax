const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const createJSX = require('../utils/createJSX');

const TEMPLATE_AST = 'templateAST';

function transformTag(ast) {
  traverse(ast, {
    JSXText(path) {
      // <View>hello</View> => <View><text>hello</text></View>
      const { node, parentPath } = path;
      if (t.isJSXElement(parentPath) && path.node.value && path.node.value.trim().length) {
        const openTagName = parentPath.node.openingElement.name;
        if (t.isJSXIdentifier(openTagName, { name: 'rax-view' }) || t.isJSXIdentifier(openTagName, { name: 'rax-link' })) {
          path.replaceWith(createJSX('text', {}, [path.node]));
        }
      }
    },
    JSXExpressionContainer(path) {
      // <View>{'hello'}</View> => <View><text>hello</text></View>
      const { node, parentPath } = path;
      if (t.isJSXElement(parentPath) && (t.isIdentifier(node.expression) || t.isMemberExpression(node.expression))) {
        const openTagName = parentPath.node.openingElement.name;
        if (t.isJSXIdentifier(openTagName, { name: 'rax-view' }) || t.isJSXIdentifier(openTagName, { name: 'rax-link' })) {
          path.replaceWith(createJSX('text', {}, [path.node]));
        }
      }
    },
  });
}

module.exports = {
  parse(parsed, code, options) {
    transformTag(parsed[TEMPLATE_AST]);
  },

  _transformTag: transformTag,
};
