const generate = require('@babel/generator').default;
const { generateOption } = require('./options');

const SELF_CLOSE_TAGS = new Set([
  'import',
  'input',
]);

/**
 * Create axml template string.
 * @param tag {String} Tag name.
 * @param attrs {Object}  Attributes.
 * @param children? {Array>} Child nodes.
 */
function generateElement({ tag, attrs, children }) {
  let ret = `<${tag} ${generateAttrs(attrs)}`;

  if (SELF_CLOSE_TAGS.has(tag)) {
    ret += ' />';
    return ret;
  } else {
    ret += '>';
  }

  if (Array.isArray(children) && children.length > 0) {
    for (let i = 0, l = children.length; i < l; i++) {
      // Consider to format indentation?
      if (typeof children[i] === 'string') {
        ret += children[i];
      } else {
        ret += generateElement(children[i]);
      }
    }
  }

  ret += `</${tag}>`;
  return ret;
}


/**
 * Generate attrs as string.
 * @param attrs {Object} Attr object.
 * @return {string} Attr string.
 */
function generateAttrs(attrs = {}) {
  const keys = Object.keys(attrs);
  let ret = '';

  for (let i = 0, l = keys.length; i < l; i ++) {
    const key = keys[i];
    const value = attrs[key];

    if (value === false) {
      continue;
    }

    ret += `${key}="${value}"`;

    if (i !== l - 1) {
      ret += ' ';
    }
  }

  return ret;
}

/**
 * @param expression {Expression}
 * @return {String}
 */
function generateCodeByExpression(expression) {
  const { code } = generate(expression, generateOption);
  return code;
}

exports.generateElement = generateElement;
exports.generateCodeByExpression = generateCodeByExpression;
