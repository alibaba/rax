const t = require('@babel/types');

module.exports = function() {
  return {
    visitor: {
      JSXElement(path) {
        const { node } = path;
        if (node.children.length > 0) {
          let chidlren = [];

          node.children.forEach(n => {
            if (t.isJSXText(n)) {
              const str = n.value.trim();
              if (str) {
                chidlren.push(t.stringLiteral(str));
              }
            } else if (t.isJSXExpressionContainer(n)) {
              if (t.isArrayExpression(n.expression)) {
                chidlren = chidlren.concat(n.expression.elements);
              } else {
                chidlren.push(n.expression);
              }
            } else {
              chidlren.push(n);
            }
          });

          if (chidlren.length > 1) {
            let arrayExpression = t.jsxExpressionContainer(t.arrayExpression(chidlren));
            node.children = [arrayExpression];
          }
        }
      }
    }
  };
};