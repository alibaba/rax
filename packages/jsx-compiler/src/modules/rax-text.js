const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const genExpression = require('../codegen/genExpression');

function transformRaxText(ast) {
  traverse(ast, {
    JSXOpeningElement(path) {
      const { node } = path;
      const componentTagNode = node.name;
      // For text content
      if (componentTagNode.name === 'rax-text') {
        node.attributes.push(
          t.jsxAttribute(
            t.jsxIdentifier('__content'),
            t.stringLiteral(
              path.parent.children.reduce((prev, next) => {
                return prev + genExpression(next, {
                  concise: true,
                  comments: false,
                });
              }, '')
            )
          )
        );
      }
    }
  });
}

module.exports = {
  parse(parsed, code, options) {
    if (options.adapter.compatibleText) {
      transformRaxText(parsed.templateAST);
    }
  }
};
