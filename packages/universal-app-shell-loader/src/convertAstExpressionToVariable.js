const t = require('@babel/types');

module.exports = function convertAstExpressionToVariable(node) {
  if (t.isObjectExpression(node)) {
    const obj = {};
    const properties = node.properties;
    properties.forEach(property => {
      if (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') {
        const key = convertAstExpressionToVariable(property.key);
        const value = convertAstExpressionToVariable(property.value);
        obj[key] = value;
      }
    });
    return obj;
  } else if (t.isArrayExpression(node)) {
    return node.elements.map(convertAstExpressionToVariable);
  } else if (t.isLiteral(node)) {
    return node.value;
  } else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
    const name = node.name;
    return name === 'undefined'
      ? undefined
      : name;
  } else if (t.isJSXExpressionContainer(node)) {
    return convertAstExpressionToVariable(node.expression);
  }
};
