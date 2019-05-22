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
            throw new Error(`目前暂不支持对 ${genExpression(node)} 的语法转换，请使用内联函数。`);
          }

          parentPath.replaceWith(
            createJSX('block', {
              [adapter.for]: t.stringLiteral(createBinding(genExpression(callee.object))),
              [adapter.forItem]: t.stringLiteral(createBinding(itemName)),
              [adapter.forIndex]: t.stringLiteral(createBinding(indexName)),
            }, [childNode])
          );
        } else {
          // { foo.method(args) }
          throw new Error(`目前暂不支持在 JSX 模板中使用 ${genExpression(node)} 的语法转换，可以使用静态模板或提前计算 state 的方式代替。`);
        }
      } else if (t.isIdentifier(callee)) {
        // { foo(args) }
        throw new Error(`目前暂不支持在 JSX 模板中使用 ${genExpression(node)} 的语法转换，可以使用静态模板或提前计算 state 的方式代替。`);
      } else if (t.isFunction(callee)) {
        throw new Error(`目前暂不支持在 JSX 模板中使用 IIFE: ${genExpression(node)} 。`);
      }
    }
  });
}

module.exports = {
  parse(parsed, code, options) {
    transformList(parsed.templateAST, options.adapter);
  },
};
