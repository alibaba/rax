const {
  isPreveredIdentifier,
  isPreveredGlobalObject,
  isValidIdentifier,
  isSFCInternalIdentifier,
  isRenderHelperFns,
  no
} = require('../utils');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

/**
 * Scan code expression, and declear identifier
 * eg. _c('view') -> `var _c = renderHelpers._c`;
 * @param {String} code source of the code
 * @param isPrevented {Function} isPrevered whitelist
 * @param scope {String} Scope identifier.
 * @return {String} Code.
 */
module.exports = function(code, isPrevented = no, scope = 'this') {
  const ast = parseAST(code);
  const recordIds = {};

  function add(node) {
    if (
      t.isIdentifier(node) &&
      !isPrevented(node.name) &&
      !isPreveredIdentifier(node.name) &&
      !isPreveredGlobalObject(node.name) &&
      !isSFCInternalIdentifier(node.name) &&
      !isRenderHelperFns(node.name)
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
    ArrayExpression(path) {
      const { node } = path;
      if (node.elements) {
        node.elements.forEach(add);
      }
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

  // Generate scope binding code
  return generateCode(recordIds, scope);
};

function parseAST(code) {
  try {
    return babylon.parse(code, {
      plugins: ['objectRestSpread']
    });
  } catch (err) {
    console.warn(code);
    throw new Error('Babylon parse err at with scope: ' + err.message);
  }
}

function generateCode(keys, scope) {
  let code = '';
  for (let name in keys) {
    if (keys.hasOwnProperty(name)) {
      code += `var ${name} = ${scope}${
        isValidIdentifier(name)
          ? '.' + name
          : "['" + name + "']"
      };`;
    }
  }
  return code;
}
