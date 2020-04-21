/**
 * https://johnresig.com/files/htmlparser.js
 */

// Reg
const doctypeReg = /^<!\s*doctype((?:\s+[\w:]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i;
const startTagReg = /^<([-A-Za-z0-9_]+)((?:\s+[-A-Za-z0-9_:@.]+(?:\s*=\s*(?:(?:"[^"]*")|(?:'[^']*')|[^>\s]+))?)*)\s*(\/?)>/i;
const endTagReg = /^<\/([-A-Za-z0-9_]+)[^>]*>/i;
const attrReg = /([-A-Za-z0-9_:@.]+)(?:\s*=\s*(?:(?:"((?:\\.|[^"])*)")|(?:'((?:\\.|[^'])*)')|([^>\s]+)))?/g;

// Empty element - https://www.w3.org/TR/html/syntax.html#void-elements
const voidMap = {};
['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'].forEach(n => voidMap[n] = true);

// Block element - https://developer.mozilla.org/en-US/docs/Web/HTML/Block-level_elements#Elements
const blockMap = {};
['address', 'article', 'aside', 'blockquote', 'canvas', 'dd', 'div', 'dl', 'dt', 'fieldset', 'figcaption', 'figure', 'footer', 'form', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'header', 'hgroup', 'hr', 'li', 'main', 'nav', 'noscript', 'ol', 'output', 'p', 'pre', 'section', 'table', 'tfoot', 'ul', 'video'].forEach(n => blockMap[n] = true);

// Inline element - https://developer.mozilla.org/en-US/docs/Web/HTML/Inline_elements#Elements
const inlineMap = {};
['a', 'abbr', 'acronym', 'b', 'bdo', 'big', 'br', 'button', 'cite', 'code', 'dfn', 'em', 'i', 'img', 'input', 'kbd', 'label', 'map', 'object', 'q', 'samp', 'script', 'select', 'small', 'span', 'strong', 'sub', 'sup', 'textarea', 'time', 'tt', 'var'].forEach(n => inlineMap[n] = true);

// An element that may contain arbitrary content- https://www.w3.org/TR/html/syntax.html#raw-text
const rawTextMap = {};
['script', 'style'].forEach(n => rawTextMap[n] = true);

const longAttributeCache = {};
let seed = 0;

function tokenize(content, handler) {
  const stack = [];
  let last = content;

  stack.last = function() {
    return this[this.length - 1];
  };

  while (content) {
    let isText = true;

    if (!stack.last() || !rawTextMap[stack.last()]) {
      if (content.indexOf('<!--') === 0) {
        // comment
        const index = content.indexOf('-->');

        if (index >= 0) {
          content = content.substring(index + 3);
          isText = false;
        }
      } else if (content.indexOf('</') === 0) {
        // end tag
        const match = content.match(endTagReg);

        if (match) {
          content = content.substring(match[0].length);
          match[0].replace(endTagReg, parseEndTag);
          isText = false;
        }
      } else if (content.indexOf('<') === 0) {
        // start tag
        let match = content.match(startTagReg);

        if (match) {
          content = content.substring(match[0].length);
          match[0].replace(startTagReg, parseStartTag);
          isText = false;
        } else {
          // 检测 doctype
          match = content.match(doctypeReg);

          if (match) {
            content = content.substring(match[0].length);
            isText = false;
          }
        }
      }

      if (isText) {
        const index = content.indexOf('<');

        const text = index < 0 ? content : content.substring(0, index);
        content = index < 0 ? '' : content.substring(index);

        if (handler.text) handler.text(text);
      }
    } else {
      const execRes = new RegExp(`</${stack.last()}[^>]*>`).exec(content);

      if (execRes) {
        const text = content.substring(0, execRes.index);
        content = content.substring(execRes.index + execRes[0].length);

        text.replace(/<!--(.*?)-->/g, '');
        if (text && handler.text) handler.text(text);
      }

      parseEndTag('', stack.last());
    }

    if (content === last) throw new Error(`parse error: ${content}`);
    last = content;
  }

  // Close the label in the stack
  parseEndTag();

  function parseStartTag(tag, tagName, rest, unary) {
    tagName = tagName.toLowerCase();
    unary = !!unary;

    unary = voidMap[tagName] || !!unary;

    if (!unary) stack.push(tagName);

    if (handler.start) {
      const attrs = [];

      try {
        rest.replace(attrReg, (all, $1, $2, $3, $4) => {
          const value = $2 || $3 || $4;

          attrs.push({
            name: $1,
            value,
          });
        });
      } catch (err) {
        // Some android will kneel down when performing a property regex on a string that is too long (mainly base 64)
        rest = rest.replace(/url\([^)]+\)/ig, all => {
          const id = `url(:#|${++seed}|#:)`;
          longAttributeCache[id] = all;
          return id;
        });
        rest.replace(attrReg, (all, $1, $2, $3, $4) => {
          const value = $2 || $3 || $4;

          attrs.push({
            name: $1,
            value: value.replace(/url\(:#\|\d+\|#:\)/ig, all => longAttributeCache[all] || 'url()'),
          });
        });
      }

      handler.start(tagName, attrs, unary);
    }
  }

  function parseEndTag(tag, tagName) {
    let pos;

    if (!tagName) {
      pos = 0;
    } else {
      // Find the start tag with the same name
      tagName = tagName.toLowerCase();

      for (pos = stack.length - 1; pos >= 0; pos--) {
        if (stack[pos] === tagName) break;
      }
    }

    if (pos >= 0) {
      // Close all tags in the start and end tags
      for (let i = stack.length - 1; i >= pos; i--) {
        if (handler.end) handler.end(stack[i]);
      }

      stack.length = pos;
    }
  }
}

function parse(html) {
  const r = {
    children: [],
  };
  const stack = [r];

  stack.last = function() {
    return this[this.length - 1];
  };

  tokenize(html, {
    start(tagName, attrs, unary) {
      const node = {
        type: 'element',
        tagName,
        attrs,
        unary,
        children: [],
      };

      stack.last().children.push(node);

      if (!unary) {
        stack.push(node);
      }
    },
    // eslint-disable-next-line no-unused-vars
    end(tagName) {
      const node = stack.pop();

      if (node.tagName === 'table') {
        // Supplement insert tbody
        let hasTbody = false;

        for (const child of node.children) {
          if (child.tagName === 'tbody') {
            hasTbody = true;
            break;
          }
        }

        if (!hasTbody) {
          node.children = [{
            type: 'element',
            tagName: 'tbody',
            attrs: [],
            unary: false,
            children: node.children,
          }];
        }
      }
    },
    text(content) {
      content = content.trim();
      if (!content) return;

      stack.last().children.push({
        type: 'text',
        content,
      });
    },
  });

  return r.children;
}

export default {
  tokenize,
  parse,
  voidMap,
  blockMap,
  inlineMap,
  rawTextMap,
};
