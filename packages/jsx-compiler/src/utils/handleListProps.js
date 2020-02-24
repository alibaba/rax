const t = require('@babel/types');
const { isDirectiveAttr, isEventHandlerAttr, BINDING_REG } = require('./checkAttr');
const handleList = require('./handleList');

/**
 * @param {NodePath} path - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 * */
module.exports = function(...args) {
  const path = args[0];
  const { node } = path;
  const attrName = node.name.name;
  if (attrName !== 'style'
    && !isEventHandlerAttr(attrName)
    && !isDirectiveAttr(attrName)
  ) {
    if (t.isJSXExpressionContainer(node.value)) {
      handleList(null, ...args, node.value.expression);
    } else if (t.isStringLiteral(node.value)) {
      // override prev level list value
      if (BINDING_REG.test(node.value.value) && node.value.__originalExpression) {
        node.value.__properties.properties.splice(node.value.__properties.index, 1);
        node.value = t.jsxExpressionContainer(node.value.__originalExpression);
        handleList(null, ...args, node.value.expression);
      }
    }
  }
};
