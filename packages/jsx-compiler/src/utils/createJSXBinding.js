const t = require('@babel/types');

module.exports = function createJSXBinding(string) {
  const id = t.identifier(string);
  const jsxExp = t.jsxExpressionContainer(t.objectExpression([
    t.objectProperty(id, id, false, true)
  ]));
  jsxExp.__transformed = true; // In case of loop transform.
  return jsxExp;
};
