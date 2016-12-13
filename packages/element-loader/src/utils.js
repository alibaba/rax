import htmlparser from 'htmlparser2';

const SPREAD_REG = /^\.\.\.[\w$_]/;
const OBJ_REG = /^[\w$_](?:[\w$_\d\s]+)?:/;
const ES2015_OBJ_REG = /^[\w$_](?:[\w$_\d\s]+)?,/;

function innerHTML(dom) {
  return htmlparser.DomUtils.getOuterHTML(dom, {
    xmlMode: true
  });
}

export function isObject(str_) {
  const str = str_.trim();
  return str.match(SPREAD_REG) || str.match(OBJ_REG) || str.match(ES2015_OBJ_REG);
}

export function repeatString(string, times) {
  if (times === 1) {
    return string;
  }
  if (times < 0) {
    throw new Error();
  }
  let repeated = '';
  while (times) {
    if (times & 1) {
      repeated += string;
    }
    if (times >>= 1) {
      string += string;
    }
  }
  return repeated;
}

export function endsWith(haystack, needle) {
  return haystack.slice(-needle.length) === needle;
}

export function trimEnd(haystack, needle) {
  return endsWith(haystack, needle)
    ? haystack.slice(0, -needle.length)
    : haystack;
}

export function hyphenToCamelCase(string) {
  return string.replace(/-(.)/g, (match, chr) => {
    return chr.toUpperCase();
  });
}

export function isEmpty(string) {
  return !/[^\s]/.test(string);
}

export function isConvertiblePixelValue(value) {
  return /^\d+px$/.test(value);
}

export function isNumeric(input) {
  return input !== undefined
    && input !== null
    && (typeof input === 'number' || parseInt(input, 10) == input);
}

export function padding(level, str) {
  return '\n' + new Array(level + 1).join(' ') + str;
}

export function parseHtml(html) {
  const handler = new htmlparser.DomHandler();
  const parser = new htmlparser.Parser(handler, {
    xmlMode: true
  });
  parser.parseComplete(html);

  return handler.dom;
}

export function parser(html) {
  let dom = parseHtml(html);
  let importLinks = [],
    styleLinks = [],
    template = '',
    script = '',
    styles = '';

  dom.forEach((node) => {
    const {name, children, attribs} = node;
    switch (name) {
      case 'link':
        let rel = attribs.rel.toLowerCase();
        if (rel === 'import') {
          importLinks.push(attribs.href);
        }
        if (rel === 'stylesheet') {
          styleLinks.push(attribs.href);
        }
        break;
      case 'template':
        template = innerHTML(children);
        break;
      case 'style':
        styles += innerHTML(children);
        break;

      case 'script':
        script = innerHTML(children);
        break;
      default:
        break;
    }
  });

  return {
    template: {
      type: 'template',
      content: template,
      lang: ''
    },
    script: {
      type: 'script',
      content: script,
      lang: ''
    },

    styles: {
      type: 'style',
      content: styles
    },

    importLinks: importLinks,
    styleLinks: styleLinks
  };
}

