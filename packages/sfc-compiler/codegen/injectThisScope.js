const { makeMap } = require('sfc-shared-utils');
const { uniqueInstanceID } = require('sfc-shared-utils');
const babylon = require('babylon');
const traverse = require('babel-traverse').default;
const t = require('babel-types');

// global object that prevered
const isPreveredGlobalObject = makeMap(
  'Object,Array,String,Number,Symbol,Function,RegExp,' +
  'Math,Date,JSON,console,' +
  'Proxy,Promise,Reflect,Set,Map,ArrayBuffer' +
  'Int8Array,Uint8Array,Uint8ClampedArray,Int16Array,Uint16Array,Int32Array,Uint32Array,Float32Array,Float64Array'
);

/**
 * 类似 with, 注入 scope binding
 * _c(foo) --> _c(this.foo)
 * @param {String} code 源码
 * @param {Function} existsScope 白名单
 * @param {String} prefix 前缀
 */
module.exports = function (code, existsScope = () => false, prefix = 'this') {
  let ast;
  try {
    ast = babylon.parse(code, {
      plugins: ['objectRestSpread']
    });
  } catch (err) {
    console.log(code);
    throw new Error('Babylon parse err at inject this scope: ' + err.message);
  }

  const names = {};

  function add(node) {
    if (
      t.isIdentifier(node) &&
      !existsScope(node.name) &&
      // preserved identifier
      !isPreveredGlobalObject(node.name) &&
      !node.name.startsWith(`$_${uniqueInstanceID}`) &&
      node.name !== '_st'
    ) {
      names[node.name] = true;
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

  // 获取 this scope binding
  const variableDeclarations = Object.keys(names)
    .map(
      name =>
        `var ${name} = ${prefix}${
        isValidIdentifier(name) ? '.' + name : "['" + name + "']"
        };`
    )
    .join('\n');

  function isValidIdentifier(id) {
    return !/^\ws[~`!@#$%^&*()]/.test(id);
  }

  return variableDeclarations;
};

module.exports.isPreveredGlobalObject = isPreveredGlobalObject;
