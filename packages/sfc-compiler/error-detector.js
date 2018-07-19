const { dirRE, onRE } = require('./parser');

// these keywords should not appear inside expressions, but operators like
// typeof, instanceof and in are allowed
const prohibitedKeywordRE = new RegExp(
  '\\b' +
    (
      'do,if,for,let,new,try,var,case,else,with,await,break,catch,class,const,' +
      'super,throw,while,yield,delete,export,import,return,switch,default,' +
      'extends,finally,continue,debugger,function,arguments'
    )
      .split(',')
      .join('\\b|\\b') +
    '\\b'
);

// these unary operators should not be used as property/method names
const unaryOperatorsRE = new RegExp(
  '\\b' +
    'delete,typeof,void'.split(',').join('\\s*\\([^\\)]*\\)|\\b') +
    '\\s*\\([^\\)]*\\)'
);

// check valid identifier for v-for
const identRE = /[A-Za-z_$][\w$]*/;

// strip strings in expressions
const stripStringRE = /'(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*\$\{|\}(?:[^`\\]|\\.)*`|`(?:[^`\\]|\\.)*`/g;

// detect problematic expressions in a template
exports.detectErrors = detectErrors;
function detectErrors(ast) {
  const errors = [];
  if (ast) {
    checkNode(ast, errors);
  }
  return errors;
}

function checkNode(node, errors) {
  if (node.type === 1) {
    for (const name in node.attrsMap) {
      if (dirRE.test(name)) {
        const value = node.attrsMap[name];
        if (value) {
          if (name === 'v-for') {
            checkFor(node, `v-for="${value}"`, errors);
          } else if (onRE.test(name)) {
            checkEvent(value, `${name}="${value}"`, errors);
          } else {
            checkExpression(value, `${name}="${value}"`, errors);
          }
        }
      }
    }
    if (node.children) {
      for (let i = 0; i < node.children.length; i++) {
        checkNode(node.children[i], errors);
      }
    }
  } else if (node.type === 2) {
    checkExpression(node.expression, node.text, errors);
  }
}

function checkEvent(exp, text, errors) {
  const stipped = exp.replace(stripStringRE, '');
  const keywordMatch = stipped.match(unaryOperatorsRE);
  if (keywordMatch && stipped.charAt(keywordMatch.index - 1) !== '$') {
    errors.push(
      'avoid using JavaScript unary operator as property name: ' +
        `"${keywordMatch[0]}" in expression ${text.trim()}`
    );
  }
  checkExpression(exp, text, errors);
}

function checkFor(node, text, errors) {
  checkExpression(node.for || '', text, errors);
  checkIdentifier(node.alias, 'v-for alias', text, errors);
  checkIdentifier(node.iterator1, 'v-for iterator', text, errors);
  checkIdentifier(node.iterator2, 'v-for iterator', text, errors);
}

function checkIdentifier(ident, type, text, errors) {
  if (typeof ident === 'string' && !identRE.test(ident)) {
    errors.push(`invalid ${type} "${ident}" in expression: ${text.trim()}`);
  }
}

function checkExpression(exp, text, errors) {
  try {
    new Function(`return ${exp}`);
  } catch (e) {
    const keywordMatch = exp
      .replace(stripStringRE, '')
      .match(prohibitedKeywordRE);
    if (keywordMatch) {
      errors.push(
        'avoid using JavaScript keyword as property name: ' +
          `"${keywordMatch[0]}" in expression ${text.trim()}`
      );
    } else {
      errors.push(`invalid expression: ${text.trim()}`);
    }
  }
}
