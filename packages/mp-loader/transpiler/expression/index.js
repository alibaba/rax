const { parseExpression } = require('./babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');

function toLiteralString(str) {
  return JSON.stringify(str);
}

// not allow {{x:{y:1}}}
// or use complex parser
const expressionTagReg = /\{\{([^}]+)\}\}/g;
const fullExpressionTagReg = /^\{\{([^}]+)\}\}$/;
const spreadReg = /^\.\.\.[\w$_]/;
const objReg = /^[\w$_](?:[\w$_\d\s]+)?:/;
const es2015ObjReg = /^[\w$_](?:[\w$_\d\s]+)?,/;

exports.isObject = isObject;
function isObject(str_) {
  var str = str_.trim();
  return str.match(spreadReg) || str.match(objReg) || str.match(es2015ObjReg);
}
const babylonConfig = {
  plugins: ['objectRestSpread']
};
function findScope(scope, name) {
  if (scope) {
    for (var i = 0; i < scope.length; i++) {
      var s = scope[i];
      if (s[name]) {
        return s[name];
      }
    }
  }
  return false;
}

function transformCode(code_, rmlScope, config) {
  var codeStr = code_;
  if (config.forceObject || isObject(codeStr)) {
    codeStr = '{' + codeStr + '}';
  }
  const visitor = {
    noScope: 1,
    ReferencedIdentifier: function ReferencedIdentifier(path) {
      var node = path.node,
        parent = path.parent;
      if (node.__rmlSkipped) {
        return;
      }
      var nameScope = findScope(this.rmlScope, node.name);
      if (nameScope === 'sjs') {
        var parentType = parent && parent.type;
        if (node.type === 'Identifier' && !(parentType === 'MemberExpression' && parent.object === node)) {
          var args = [t.arrayExpression([node])];
          if (parentType === 'CallExpression' && parent.callee === node) {
            args.push(t.numericLiteral(1));
          }
          var newNode = t.callExpression(t.identifier('$getSJSMember'), args);
          newNode.callee.__rmlSkipped = 1;
          path.replaceWith(newNode);
          path.skip();
        }
        return;
      }
      if (!nameScope) {
        node.name = config.scope ? (config.scope + '[\'' + node.name + '\']') : node.name;
      }
    },
    MemberExpression: function MemberExpression(path) {
      var parent = path.parent,
        node = path.node;
      var parentType = parent && parent.type;
      // do not transform function call
      // skip call callee x[y.q]
      if (
        // root member node
        parentType !== 'MemberExpression') {
        // allow {{x.y.z}} even x is undefined
        var members = [node];
        var root = node.object;
        while (root.type === 'MemberExpression') {
          members.push(root);
          root = root.object;
        }
        var isSJS = findScope(this.rmlScope, root.name) === 'sjs';
        if (!isSJS && this.strictDataMember) {
          return;
        }
        // TODO. use https://www.npmjs.com/package/babel-plugin-transform-optional-chaining
        var memberFn = isSJS ? '$getSJSMember' : '$getLooseDataMember';
        members.reverse();
        var args = [root];
        if (isSJS) {
          root.__rmlSkipped = 1;
        }
        if (root.type === 'ThisExpression') {
          args.pop();
          args.push(members.shift());
        }
        if (!members.length) {
          return;
        }
        members.forEach(function (m) {
          // x[y]
          if (m.computed) {
            args.push(m.property);
          } else {
            // x.y
            args.push(t.stringLiteral(m.property.name));
          }
        });
        var callArgs = [t.arrayExpression(args)];
        if (parent.callee === node) {
          callArgs.push(t.numericLiteral(1));
        }
        var newNode = t.callExpression(t.identifier(memberFn), callArgs);
        newNode.callee.__rmlSkipped = 1;
        // will process a.v of x.y[a.v]
        path.replaceWith(newNode);
        // path.skip();
      }
    }
  };
  var expression = parseExpression(codeStr, babylonConfig);
  var start = expression.start,
    end = expression.end;
  var ast = {
    type: 'File',
    start: start,
    end: end,
    program: {
      start: start,
      end: end,
      type: 'Program',
      body: [{
        start: start,
        end: end,
        type: 'ExpressionStatement',
        expression: expression
      }]
    }
  };
  // if (ast.type === 'Identifier') {
  //   ast.name = `data.${ast.name}`;
  // } else {
  traverse(ast, visitor, undefined, {
    rmlScope: rmlScope,
    strictDataMember: config.strictDataMember !== false
  });
  // }
  var _generate = generate(ast),
    code = _generate.code;
  if (code.charAt(code.length - 1) === ';') {
    code = code.slice(0, -1);
  }
  return code;
}
function transformExpressionByPart(str_, scope, config) {
  if (typeof str_ !== 'string') {
    return [str_];
  }
  var str = str_.trim();
  if (!str.match(expressionTagReg)) {
    return [toLiteralString(str_)];
  }
  var match = str.match(fullExpressionTagReg);
  if (match) {
    return [transformCode(match[1], scope, config)];
  }
  var totalLength = str.length;
  var lastIndex = 0;
  var gen = [];
  /* eslint no-cond-assign:0 */
  while (match = expressionTagReg.exec(str)) {
    var code = match[1];
    if (match.index !== lastIndex) {
      gen.push(toLiteralString(str.slice(lastIndex, match.index)));
    }
    gen.push(transformCode(code, scope, config));
    lastIndex = expressionTagReg.lastIndex;
  }
  if (lastIndex < totalLength) {
    gen.push(toLiteralString(str.slice(lastIndex)));
  }
  return gen;
}

exports.transformExpression = transformExpression;
function transformExpression(str_, scope) {
  var config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var ret = transformExpressionByPart(str_, scope, config);
  if ('text' in config) {
    return ret.length > 1 ? '[' + ret.join(', ') + ']' : ret[0];
  }
  return ret.join(' + ');
}

exports.hasExpression = hasExpression;
function hasExpression(str) {
  return str.match(expressionTagReg);
}
