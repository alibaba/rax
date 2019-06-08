const t = require('@babel/types');

module.exports = function createJSXBinding(string) {
  const id = t.identifier(string);
  return t.jsxExpressionContainer(t.objectExpression([
    t.objectProperty(id, id, false, true)
  ]));
};
