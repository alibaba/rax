import htmlparser from 'htmlparser2';

function innerHTML(dom) {
  return htmlparser.DomUtils.getOuterHTML(dom, {
    xmlMode: true
  });
}

export function getDomObject(html) {
  const handler = new htmlparser.DomHandler();
  const parser = new htmlparser.Parser(handler, {
    xmlMode: true
  });

  parser.parseComplete(html);

  return handler.dom;
}

export default function parser(html) {
  let dom = getDomObject(html);
  let importLinks = [],
    styleSheetLinks = [],
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
          styleSheetLinks.push(attribs.href);
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
    // allow multiple style tag
    // combine all css string
    styles: {
      type: 'style',
      content: styles
    },
    importLinks: importLinks,
    styleSheetLinks: styleSheetLinks
  };
}

