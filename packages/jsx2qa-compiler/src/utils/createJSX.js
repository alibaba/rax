const t = require('@babel/types');

module.exports = function createJSX(tag, attrs = {}, children = []) {
  const attributes = [];
  Object.keys(attrs).forEach((key) => {
    attributes.push(t.jsxAttribute(
      t.jsxIdentifier(key),
      attrs[key],
    ));
  });
  const jsxOpeningElement = t.jsxOpeningElement(
    t.jsxIdentifier(tag),
    attributes
  );
  const jsxClosingElement = t.jsxClosingElement(t.jsxIdentifier(tag));
  return t.jsxElement(jsxOpeningElement, jsxClosingElement, children);
};
