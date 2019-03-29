const generate = require('@babel/generator').default;
const generateOption = require('./option');
const { SELF_CLOSE_TAGS, SPACE_INDENT } = require('../constant');

const Node = require('../parser/Node');

const EMPTY_STR_REG = /^[\n|\s]+$/;

/**
 * Create axml template string.
 * @param node {Node}
 * @param node.tag {String} Tag name.
 * @param node.attrs {Object}  Attributes.
 * @param node.children? {Array} Child nodes.
 * @param depth {Number} Indent depth.
 */
function generateElement(node, depth = 0) {
  if (Array.isArray(node)) return node.map((n) => generateElement(n, depth)).join('\n');
  if (node === undefined || node === null) return '';

  if (!(node instanceof Node) && (typeof node === 'number' || typeof node === 'string') ) {
    return node;
  }
  const { tag, attrs, children } = node;
  let ret = SPACE_INDENT.repeat(depth) + `<${tag}`;

  const attrRet = generateAttrs(attrs);
  if (attrRet) ret += ' ' + attrRet;

  if (SELF_CLOSE_TAGS.has(tag)) {
    ret += ' />';
    return ret;
  } else {
    ret += '>';
  }

  if (Array.isArray(children) && children.length > 0) {
    for (let i = 0, l = children.length; i < l; i++) {
      const child = children[i];
      if (typeof child === 'string') {
        // Remove empty JSXString between JSX Elements.
        if (EMPTY_STR_REG.test(child)) continue;
        ret += child;
      } else {
        ret += [
          '\n',
          generateElement(child, depth + 1),
          '\n',
          SPACE_INDENT.repeat(depth),
        ].join('');
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
    } else if (value === true) {
      ret += `${key}`;
    } else {
      ret += `${key}="${value}"`;
    }

    if (i !== l - 1) {
      ret += ' ';
    }
  }

  return ret;
}

/**
 * @param expression {Expression}
 * @param overridesOption {Object}
 * @return {String}
 */
function generateCodeByExpression(expression, overridesOption) {
  const { code } = generate(expression, Object.assign({}, generateOption, overridesOption));
  return code;
}

exports.generateElement = generateElement;
exports.generateCodeByExpression = generateCodeByExpression;
