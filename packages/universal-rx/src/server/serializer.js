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

function createOpenTagMarkup(tagName, style, attributes) {
  let tagOpen = `<${tagName}`;

  if (style) {
    let styleAttr = styleToCSS(style, true);
    if (styleAttr) {
      tagOpen += ' ' + quoteAttribute('style', styleAttr);
    }
  }

  if (attributes) {
    for (let attrKey in attributes) {
      tagOpen += ' ' + quoteAttribute(attrKey, attributes[attrKey]);
    }
  }

  return tagOpen;
}

class Serializer {
  constructor(node) {
    this.html = '';
    this.startNode = node;
  }

  toJSON() {
    return this.toJSONChildren(this.startNode, true);
  }

  toJSONChildren(parentNode, isTopLevel) {
    let childNodes = parentNode.childNodes;

    if (childNodes) {
      let children = [];

      for (let i = 0, len = childNodes.length; i < len; i++) {
        let node = childNodes[i];
        if (node.nodeType === ELEMENT_NODE) {
          let tagName = node.tagName.toLowerCase();
          let props = {};

          if (node.style) {
            let css = styleToCSS(node.style, true);
            if (css) {
              props.style = css;
            }
          }

          if (node.attributes) {
            props = Object.assign(props, node.attributes);
          }

          let json = {
            type: tagName,
            props,
            children: this.toJSONChildren(node),
          };

          children.push(json);
        } else if (node.nodeType === TEXT_NODE) {
          var text = node.data;
          if (typeof text === 'string') {
            text = escapeText(text);
          }
          children.push(text);
        }
      }

      // Do not wrap array when only child in top-level
      if (isTopLevel && children.length === 1) {
        return children[0];
      }

      return children.length === 0 ? null : children;
    }

    return null;
  }

  serialize() {
    this.serializeChildren(this.startNode);
    return this.html;
  }

  serializeChildren(parentNode) {
    let childNodes = parentNode.childNodes;

    if (childNodes) {
      for (let i = 0, len = childNodes.length; i < len; i++) {
        let node = childNodes[i];
        if (node.nodeType === ELEMENT_NODE) {
          let tagName = node.tagName.toLowerCase();

          this.html += createOpenTagMarkup(tagName, node.style, node.attributes);

          if (OMITTED_CLOSE_TAGS[tagName]) {
            this.html += '/>';
          } else {
            this.html += '>';
            if (node.__html) {
              this.html += node.__html;
            } else {
              this.serializeChildren(node);
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
