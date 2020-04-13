const t = require('@babel/types');
const { isEventHandlerAttr, BINDING_REG } = require('./checkAttr');
const handleList = require('./handleList');
const genExpression = require('../codegen/genExpression');
const findIndex = require('./findIndex');

/**
 * @param {NodePath} path - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicBinding - dynamic style generator
 * @param {string} code - original code
 * @param {object} adapter - adapter
 * */
module.exports = function(...args) {
  const path = args[0];
  const { node } = path;
  const attrName = node.name.name;
  if (attrName !== 'style' && attrName !== 'x-for' && !isEventHandlerAttr(attrName)) {
    if (t.isJSXExpressionContainer(node.value)) {
      handleList(null, node.value.expression, ...args);
    } else if (t.isStringLiteral(node.value)) {
      // override prev level list value
      if (BINDING_REG.test(node.value.value) && node.value.__originalExpression) {
        const propertyIndex = findIndex(node.value.__properties, (property) => property === node.value.__originalExpression);
        node.value.__properties.splice(propertyIndex, 1);
        node.value = t.jsxExpressionContainer(node.value.__originalExpression);
        handleList(null, node.value.expression, ...args);
      }
    }
  }
};
