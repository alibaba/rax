import {
  transformFor,
  transformIf,
  transformImport
} from './transformer';
import htmlparser from 'htmlparser2';
import {IF_KEY, FOR_KEY, IMPORT_NAME} from './defaultKey';
import {
  endsWith,
  trimEnd,
  isNumeric
} from './utils';

const NODE_TYPE = {
  ELEMENT: 'tag',
  TEXT: 'text',
  COMMENT: 'comment',
  SCRIPT: 'script',
  STYLE: 'style'
};

export default class HTMLtoJSX {
  constructor(config) {
    this.config = config || {};
    this.createClass = false;

    if (!this.config.indent) {
      this.config.indent = '  ';
    }
  }

  reset() {
    this.output = '';
    this.outputImportText = '';
    this.level = 0;
  }

  convert(html) {
    this.reset();

    html = this._cleanInput(html);

    let nodes = this._parseHtml(html);

    if (!this._onlyOneTopLevel(nodes)) {
      this.level++;
      html = `<div>\n${html}\n</div>`;
      nodes = this._parseHtml(html);
    }

    this._traverse({
      children: nodes
    });

    this.output = this.output.trim() + '\n';

    return {
      output: this.output,
      outputImportText: this.outputImportText
    };
  }

  _traverse(node) {
    node.children = node.children || [];
    this.level++;
    node.children.forEach((child) => {
      this._visit(child);
    });
    this.level--;
  }

  _visit(node) {
    // remove enter
    if (node.data && /^\n(\s?)+$/.test(node.data)) {
      return;
    }
    node.attributes = [];
    for(const key in node.attribs) {
      node.attributes.push({
        name: key,
        value: node.attribs[key]
      });
    }
    this._beginVisit(node);
    this._traverse(node);
    this._endVisit(node);
  }

  _beginVisit(node) {
    this.output += '\n' + new Array(this.level - 1).join(' ');
    switch (node.type) {
      case NODE_TYPE.ELEMENT:
        this._beginVisitElement(node);
        break;

      case NODE_TYPE.TEXT:
        this._visitText(node);
        break;

      case NODE_TYPE.COMMENT:
        this._visitComment(node);
        break;

      case NODE_TYPE.SCRIPT:
        break;
      case NODE_TYPE.STYLE:
        break;
      default:
        console.warn('Unrecognised node type: ' + node.type);
    }
  }

  _endVisit(node) {
    switch (node.type) {
      case NODE_TYPE.ELEMENT:
        this.output += '\n' + new Array(this.level + 1).join(' ');
        this._endVisitElement(node);
        break;
      case NODE_TYPE.TEXT:
      case NODE_TYPE.COMMENT:
      case NODE_TYPE.SCRIPT:
      case NODE_TYPE.STYLE:
        break;
    }
  }

  _beginVisitElement(node) {
    const tagName = node.name;
    const outputTagName = tagName;
    let attributes = [];

    if (tagName === IMPORT_NAME) {
      let attribs = node.attribs;
      this.outputImportText += transformImport(attribs.name, attribs.from);
      return;
    }

    node.attributes.forEach((attribute) => {
      attributes.push(this._getElementAttribute(node, attribute));
    });

    this.output += transformIf(node.attributes, true);
    this.output += transformFor(node.attributes, true);
    this.output += `<${outputTagName}`;
    if (attributes.length > 0) {
      this.output += ' ' + attributes.join(' ');
    }
    this.output += '>';
  }

  _endVisitElement(node) {
    const tagName = node.name;
    const outputTagName = tagName;

    if (tagName === IMPORT_NAME) {
      return;
    }
    this.output = trimEnd(this.output, this.config.indent);
    this.output += '</' + outputTagName + '>';
    this.output += transformIf(node.attributes, false);
    this.output += transformFor(node.attributes, false);
  }

  _visitText(node) {
    let text = node.data;

    text = text.replace(/^\{\{(.*)}\}$/, '{$1}');
    this.output += text;
  }

  _visitComment(node) {
    this.output += `{/*${node.data.replace('*/', '* /')}*/}`;
  }

  _parseHtml(html) {
    const handler = new htmlparser.DomHandler();
    const parser = new htmlparser.Parser(handler, {
      xmlMode: true
    });
    parser.parseComplete(html);

    return handler.dom;
  }

  _onlyOneTopLevel(nodes) {
    let _rootNodes = nodes.filter((node) => {
      return !/\n+/.test('\n') && node.name !== IMPORT_NAME;
    });
    return _rootNodes.length === 1;
  }

  _getElementAttribute(node, attribute) {
    switch (attribute.name) {
      case 'src':
        return `source={{uri: "${attribute.value}"}}`;
      case IF_KEY:
      case FOR_KEY:
        break;
      default:
        const tagName = node.name;
        const name = attribute.name;
        let result = name;

        // Numeric values should be output as {123} not "123"
        if (isNumeric(attribute.value)) {
          result += `={${attribute.value}}`;
        } else if (attribute.value.length > 0) {
          result += `="${attribute.value.replace(/"/gm, '&quot;')}"`;
        }
        return result;
    }
  }

  _cleanInput(html) {
    html = html.trim();
    return html;
  }
}
