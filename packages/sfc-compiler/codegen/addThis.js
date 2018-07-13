const { uniqueInstanceID } = require('sfc-shared-utils');
const { isPreveredGlobalObject } = require('./injectThisScope');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');

function getIters(el, iters = {}) {
  if (!el) {
    return iters;
  } else {
    const { alias, iterator1, iterator2 } = el;
    if (alias) {
      iters[alias] = true;
    }
    if (iterator1) {
      iters[iterator1] = true;
    }
    if (iterator2) {
      iters[iterator2] = true;
    }
    return Object.assign({}, iters, getIters(el.parent));
  }
}

module.exports = function (code, existsScope = () => false, el) {
  const ast = babylon.parse(code);
  const iters = getIters(el);

  function isLiteral(node) {
    return t.isNumericLiteral(node) || t.isStringLiteral(node);
  }

  const visitor = {
    MemberExpression(path) {
      const { node } = path;
      if (existsScope(node.object.name)) {
        const objectPath = path.get('object');
        node.object.done = true;
        objectPath.replaceWith(
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('_global')),
            t.stringLiteral(node.object.name),
            true
          )
        );
        node.object.done = true;
      }
      if (
        t.isIdentifier(node.object) &&
        !isPreveredGlobalObject(node.object.name) &&
        (t.isIdentifier(node.property) || isLiteral(node.property))
      ) {
        node.object.done = true;
        node.object = t.memberExpression(t.thisExpression(), node.object);
        node.object.done = true;
      }
    },

    Identifier(path) {
      const { node, parent } = path;
      const parentMem = path.findParent(path =>
        path.isMemberExpression(path.node)
      );
      if (parentMem) {
        return;
      }

      if (node.name === '$event') {
        return;
      }

      // v-for 递归器中有 iter 变量, 不需要 add this
      if (iters[node.name]) {
        return;
      }

      if (t.isObjectProperty(path.parent)) {
        return;
      }

      if (existsScope(node.name)) {
        path.replaceWith(
          t.memberExpression(
            t.memberExpression(t.thisExpression(), t.identifier('_global')),
            t.stringLiteral(node.name),
            true
          )
        );
        return;
      }

      if (isPreveredGlobalObject(node.name)) {
        return;
      }

      if (!node.done) {
        node.done = true;
        path.replaceWith(t.memberExpression(t.thisExpression(), node));
      }
    }
  };

  traverse(ast, visitor);

  return generate(ast).code;
};
