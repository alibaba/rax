const generateAttrs = require('./genAttrs');
const Node = require('../Node');

const SPACE_INDENT = '  ';

/**
 * Self closed tag, like: <input />
 */
const SELF_CLOSE_TAGS = new Set([
  'import',
  'input',
]);
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

module.exports = generateElement;
