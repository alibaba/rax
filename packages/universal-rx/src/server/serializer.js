import escapeText from './escapeText';
import styleToCSS from '../style/styleToCSS';

const ELEMENT_NODE = 1;
const TEXT_NODE = 3;
const COMMENT_NODE = 8;

// For HTML, certain tags should omit their close tag. We keep a whitelist for
// those special-case tags.
const OMITTED_CLOSE_TAGS = {
  'area': true,
  'base': true,
  'br': true,
  'col': true,
  'embed': true,
  'hr': true,
  'img': true,
  'input': true,
  'keygen': true,
  'link': true,
  'meta': true,
  'param': true,
  'source': true,
  'track': true,
  'wbr': true,
};

/**
 * Escapes attribute value to prevent scripting attacks.
 *
 * @param {*} value Value to escape.
 * @return {string} An escaped string.
 */
function quoteAttribute(prop, value) {
  return `${prop}="${escapeText(value)}"`;
}

function createOpenTagMarkup(node) {
  // Creates markup for the open tag and all attributes.
  const tagName = node.tagName.toLowerCase();
  let tagOpen = `<${tagName}`;

  if (node.style) {
    let styleAttr = styleToCSS(node.style, true);
    if (styleAttr) {
      tagOpen += ' ' + quoteAttribute('style', styleAttr);
    }
  }

  let attributes = node.attributes;
  for (let attrKey in attributes) {
    tagOpen += ' ' + quoteAttribute(attrKey, attributes[attrKey]);
  }

  return tagOpen;
}

class Serializer {
  constructor(node) {
    this.html = '';
    this.startNode = node;
  }

  serialize() {
    this.serializechildren(this.startNode);
    return this.html;
  }

  serializechildren(parentNode) {
    let childNodes = parentNode.childNodes;

    if (childNodes) {
      for (let i = 0, len = childNodes.length; i < len; i++) {
        let node = childNodes[i];
        if (node.nodeType === ELEMENT_NODE) {
          let tagName = node.tagName.toLowerCase();

          this.html += createOpenTagMarkup(node);

          if (OMITTED_CLOSE_TAGS[tagName]) {
            this.html += '/>';
          } else {
            this.html += '>';
            if (node.__html) {
              this.html += node.__html;
            } else {
              this.serializechildren(node);
            }
            this.html += `</${tagName}>`;
          }
        } else if (node.nodeType === TEXT_NODE) {
          this.html += escapeText(node.data);
        } else if (node.nodeType === COMMENT_NODE) {
          this.html += '<!--' + node.data + '-->';
        }
      }
    }
  }
}

export default Serializer;
