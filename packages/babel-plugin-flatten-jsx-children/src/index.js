const t = require('@babel/types');

module.exports = function() {
  return {
    visitor: {
      JSXElement(path) {
        const { node } = path;
        if (node.children.length > 0) {
          let children = [];

          node.children.forEach(n => {
            if (t.isJSXText(n)) {
              const str = n.value.trim();
              if (str) {
                children.push(t.stringLiteral(str));
              }
            } else if (t.isJSXExpressionContainer(n)) {
              if (t.isArrayExpression(n.expression)) {
                children = children.concat(n.expression.elements);
              } else {
                children.push(n.expression);
              }
            } else {
              children.push(n);
            }
          });

          if (children.length > 1) {
            let arrayExpression = t.jsxExpressionContainer(t.arrayExpression(children));
            node.children = [arrayExpression];
          }
        }
      }
    }
  };
};