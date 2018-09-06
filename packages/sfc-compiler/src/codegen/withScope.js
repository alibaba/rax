const {
  isPreveredIdentifier,
  isPreveredGlobalObject,
  isValidIdentifier,
  isSFCInternalIdentifier,
  isVDOMHelperFns,
  no
} = require('../utils');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

/**
 * like with, for identifier add scope binding
 * eg. _c(foo) --> _c(this.foo)
 * @param {String} code source of the code
 * @param {Function} isPrevered whitelist
 * @param {String} scope
 */
module.exports = function(code, isPrevered = no, scope = 'this') {
  let ast;
  try {
    ast = babylon.parse(code, {
      plugins: ['objectRestSpread']
    });
  } catch (err) {
    console.warn(code);
    throw new Error('Babylon parse err at with scope: ' + err.message);
  }

  const recordIds = {};

  function add(node) {
    if (
      t.isIdentifier(node) &&
      !isPrevered(node.name) &&
      !isPreveredIdentifier(node.name) &&
      !isPreveredGlobalObject(node.name) &&
      !isSFCInternalIdentifier(node.name) &&
      !isVDOMHelperFns(node.name)
    ) {
      recordIds[node.name] = true;
    }
  }

  const visitor = {
    CallExpression(path) {
      const { node } = path;
      if (Array.isArray(node.arguments)) {
        for (let i = 0, l = node.arguments.length; i < l; i++) {
          add(node.arguments[i]);

          if (t.isMemberExpression(node.arguments[i])) {
            add(node.arguments[i].object);
          }
        }
      }

      add(node.callee);
    },
    BinaryExpression(path) {
      const { node } = path;
      add(node.left);
      add(node.right);
    },
    ConditionalExpression(path) {
      const { node } = path;
      add(node.consequent);
      add(node.alternate);
      add(node.test);
    },
    UnaryExpression(path) {
      const { node } = path;
      add(node.argument);
    },
    LogicalExpression(path) {
      const { node } = path;
      add(node.left);
      add(node.right);
    },
    ObjectProperty(path) {
      const { node } = path;
      add(node.value);
    },
    SpreadProperty(path) {
      const { node } = path;
      add(node.argument);
    },
    MemberExpression(path) {
      function addMem(node) {
        if (t.isMemberExpression(node.object)) {
          addMem(node.object);
        } else {
          add(node.object);
        }
      }

      if (path.node.computed) {
        add(path.node.property);
      }
      addMem(path.node);
    }
  };

  traverse(ast, visitor);

  // generate scope binding code
  return Object.keys(recordIds)
    .map(
      name =>
        `var ${name} = ${scope}${
          isValidIdentifier(name) ? '.' + name : "['" + name + "']"
        };`
    )
    .join('');
};
