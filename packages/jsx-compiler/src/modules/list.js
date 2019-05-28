const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');
const getReturnElementPath = require('../utils/getReturnElementPath');
const createJSX = require('../utils/createJSX');
const createBinding = require('../utils/createBinding');
const genExpression = require('../codegen/genExpression');

function transformList(ast, adapter) {
  traverse(ast, {
    CallExpression(path) {
      const { node, parentPath } = path;
      const { callee, arguments: args } = node;
      if (t.isMemberExpression(callee)) {
        if (t.isIdentifier(callee.property, { name: 'map' })) {
          // { foo.map(fn) }
          let childNode = null;
          let itemName = 'item';
          let indexName = 'index';
          if (t.isFunction(args[0])) {
            // { foo.map(() => {}) }
            const returnEl = t.isBlockStatement(args[0].body)
              // () => { return xxx }
              ? getReturnElementPath(args[0].body).get('argument').node
              // () => (<jsx></jsx)
              : args[0].body;
            childNode = returnEl;
            const itemParam = args[0].params[0];
            const indexParam = args[0].params[1];
            if (itemParam) itemName = itemParam.name;
            if (indexParam) indexName = indexParam.name;
          } else if (t.isIdentifier(args[0]) || t.isMemberExpression(args[0])) {
            // { foo.map(this.xxx) }
            throw new Error(`The syntax conversion for ${genExpression(node)} is currently not supported. Please use inline functions.`);
          }

          parentPath.replaceWith(
            createJSX('block', {
              [adapter.for]: t.stringLiteral(createBinding(genExpression(callee.object))),
              [adapter.forItem]: t.stringLiteral(itemName),
              [adapter.forIndex]: t.stringLiteral(indexName),
            }, [childNode])
          );
        } else {
          // { foo.method(args) }
          throw new Error(`Syntax conversion using ${genExpression(node)} in JSX templates is currently not supported, and can be replaced with static templates or state calculations in advance.`);
        }
      } else if (t.isIdentifier(callee)) {
        // { foo(args) }
        throw new Error(`Syntax conversion using ${genExpression(node)} in JSX templates is currently not supported, and can be replaced with static templates or state calculations in advance.`);
      } else if (t.isFunction(callee)) {
        throw new Error(`Currently using IIFE in JSX templates is not supported: ${genExpression(node)} 。`);
      }
    }
  });
}

module.exports = {
  parse(parsed, code, options) {
    transformList(parsed.templateAST, options.adapter);
  },

  // For test cases.
  _transformList: transformList,
};
