const { parseExpression } = require('babylon');
const traverse = require('babel-traverse').default;
const generate = require('babel-generator').default;
const t = require('babel-types');

/**
 * Test cases
 *   1. nested object {{x:{y:1}}}
 *   2. nested object and array {{[{},{}]}}
 *   3. multi expressions {{x}} {{y}}
 *   4. expression with special chars
 *     {{
 *       a: 1
 *     }}
 * @type {RegExp}
 */
const expressionTagReg = /{{((?:.|\n)+?)}}/g;
const fullExpressionTagReg = /^{{([\s\S]*?)}}$/;
const spreadReg = /^\.\.\.[\w$_]/;
const objReg = /^[\w$_](?:[\w$_\d\s]+)?:/;
const es2015ObjReg = /^[\w$_](?:[\w$_\d\s]+)?,/;

const babylonConfig = {
  plugins: ['objectRestSpread']
};

function findScope(scope, name) {
  if (scope) {
    for (let i = 0; i < scope.length; i++) {
      let s = scope[i];
      if (s[name]) {
        return s[name];
      }
    }
  }
  return false;
}

function transformCode(code_, rmlScope, config) {
  let codeStr = code_;
  if (config.forceObject || isObjectLikeString(codeStr)) {
    codeStr = '{' + codeStr + '}';
  }
  const visitor = {
    noScope: 1,
    ReferencedIdentifier: function ReferencedIdentifier(path) {
      let node = path.node,
        parent = path.parent;
      if (node.__rmlSkipped) {
        return;
      }
      let nameScope = findScope(this.rmlScope, node.name);
      if (!nameScope) {
        node.name = config.scope ? config.scope + '[\'' + node.name + '\']' : node.name;
      }
    },
    MemberExpression: function MemberExpression(path) {
      let parent = path.parent,
        node = path.node;
      let parentType = parent && parent.type;
      // do not transform function call
      // skip call callee x[y.q]
      if (
      // root member node
        parentType !== 'MemberExpression') {
        // allow {{x.y.z}} even x is undefined
        let members = [node];
        let root = node.object;
        while (root.type === 'MemberExpression') {
          members.push(root);
          root = root.object;
        }
        if (this.strictDataMember) {
          return;
        }
        let memberFn = '$getLooseDataMember';
        members.reverse();
        let args = [root];
        if (root.type === 'ThisExpression') {
          args.pop();
          args.push(members.shift());
        }
        if (!members.length) {
          return;
        }
        members.forEach(function(m) {
          // x[y]
          if (m.computed) {
            args.push(m.property);
          } else {
            // x.y
            args.push(t.stringLiteral(m.property.name));
          }
        });
        let callArgs = [t.arrayExpression(args)];
        if (parent.callee === node) {
          callArgs.push(t.numericLiteral(1));
        }
        let newNode = t.callExpression(t.identifier(memberFn), callArgs);
        newNode.callee.__rmlSkipped = 1;
        // will process a.v of x.y[a.v]
        path.replaceWith(newNode);
        // path.skip();
      }
    }
  };

  let expression = parseExpression(codeStr, babylonConfig);
  let start = expression.start,
    end = expression.end;
  let ast = {
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
  let _generate = generate(ast),
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
  let str = str_.trim();
  if (!str.match(expressionTagReg)) {
    return [toLiteralString(str_)];
  }
  let match = str.match(fullExpressionTagReg);
  if (match && isValidJSExp('{' + match[1] + '}')) {
    return [transformCode(match[1], scope, config)];
  }
  let totalLength = str.length;
  let lastIndex = 0;
  let gen = [];
  /* eslint no-cond-assign:0 */
  while (match = expressionTagReg.exec(str)) {
    let code = match[1];
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

function transformExpression(str_, scope) {
  let config = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  let ret = transformExpressionByPart(str_, scope, config);
  if ('text' in config) {
    return ret.length > 1 ? '[' + ret.join(', ') + ']' : ret[0];
  }
  return ret.map(addParentheses).join(' + ');
}

function addParentheses(c) {
  return '(' + c + ')';
}

function hasExpression(str) {
  return str.match(expressionTagReg);
}

function isObjectLikeString(str_) {
  let str = str_.trim();
  return str.match(spreadReg) || str.match(objReg) || str.match(es2015ObjReg);
}


function toLiteralString(str) {
  return JSON.stringify(str);
}

function isValidJSExp(exp) {
  try {
    parseExpression(exp, babylonConfig);
  } catch (err) {
    return false;
  }
  return true;
}

exports.hasExpression = hasExpression;
exports.transformExpression = transformExpression;
