const t = require('@babel/types');
const handleList = require('./handleList');
const CodeError = require('./CodeError');
const findIndex = require('./findIndex');

/**
 * @param {NodePath} mapFnBodyPath - map function path
 * @param {NodePath} path - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicStyle - dynamic style generator
 * @param {string} code - original code
 * @return {boolean} useCreateStyle
 * */
module.exports = function(mapFnBodyPath, ...args) {
  let useCreateStyle = false;
  const path = args[0];
  const code = args[6];
  const { node } = path;
  if (t.isJSXIdentifier(node.name, {
    name: 'style'
  })) {
    if (!t.isJSXExpressionContainer(node.value)) {
      if (node.value.__originalExpression) {
        const propertyIndex = findIndex(node.value.__properties, ({ value }) => value === node.value.__originalExpression);
        if (propertyIndex > -1) {
          node.value.__properties.splice(propertyIndex, 1);
        }
        node.value = t.jsxExpressionContainer(node.value.__originalExpression);
      } else {
        throw new CodeError(code, node.value, node.loc,
          "Style property's value should be JSXExpressionContainer, like <View style={styles.container}></View>.");
      }
    }
    useCreateStyle = true;
    handleList(mapFnBodyPath, t.callExpression(t.identifier('__create_style__'), [node.value.expression]), ...args);
  }
  return useCreateStyle;
};
