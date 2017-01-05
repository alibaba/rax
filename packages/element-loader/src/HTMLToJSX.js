import {
  transformFor,
  transformIf,
  transformPair
} from './transformer';
import htmlparser from 'htmlparser2';
import { IF_KEY, FOR_KEY } from './defaultKey';
import {
  endsWith,
  trimEnd,
  isNumber
} from 'lodash';
import { getDomObject } from './parserHTML';

const PAIR_REG = /^\{\{(.*)}\}$/;
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
    this.scope = {};
  }

  convert(html) {
    this.reset();

    html = this._cleanInput(html);

    let nodes = getDomObject(html);

    if (!this._onlyOneTopLevel(nodes)) {
      this.level++;
      html = `<div>\n${html}\n</div>`;
      nodes = getDomObject(html);
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
    for (const key in node.attribs) {
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

    node.attributes.forEach((attribute) => {
      attributes.push(this._getElementAttribute(node, attribute));
    });

    this.output += transformFor(node.attributes, true, this.scope);
    this.output += transformIf(node.attributes, true, this.scope);
    this.output += `<${outputTagName}`;
    if (attributes.length > 0) {
      this.output += ' ' + attributes.join(' ');
    }
    this.output += '>';
  }

  _endVisitElement(node) {
    const tagName = node.name;
    const outputTagName = tagName;

    this.output = trimEnd(this.output, this.config.indent);
    this.output += '</' + outputTagName + '>';
    this.output += transformFor(node.attributes, false, this.scope);
    this.output += transformIf(node.attributes, false, this.scope);
  }

  _visitText(node) {
    let text = node.data;

    if (PAIR_REG.test(text)) {
      text = text.replace(PAIR_REG, (word, $1) => {
        if (/^\{\{([props.].*)}\}$/.test(text)) {
          return `{${$1}}`;
        }
        return `{${transformPair($1, this.scope)}}`;
      });
    }
    this.output += text;
  }

  _visitComment(node) {
    this.output += `{/*${node.data.replace('*/', '* /')}*/}`;
  }

  _onlyOneTopLevel(nodes) {
    let _rootNodes = nodes.filter((node) => {
      return !/\n+/.test('\n');
    });
    return _rootNodes.length === 1;
  }

  _getElementAttribute(node, attribute) {
    switch (attribute.name) {
      case 'src':
        return `source={{uri: "${attribute.value}"}}`;
      case 'class':
        const value = attribute.value.trim();
        let multiClass = value.split(' ');
        let style = '';

        if (multiClass.length === 1) {
          style = `styles.${multiClass[0]}`;
        } else {
          style += '[';
          multiClass = multiClass.map((className) => {
            return `styles.${className}`;
          });
          style += multiClass.join(', ');

          style += ']';
        }

        return `style={${style}}`;
      case IF_KEY:
      case FOR_KEY:
        break;
      default:
        const tagName = node.name;
        const name = attribute.name;
        let result = name;

        // Numeric values should be output as {123} not "123"
        if (isNumber(attribute.value)) {
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
