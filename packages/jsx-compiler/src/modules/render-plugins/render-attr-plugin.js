const { EVENT_MAPS, ATTR_MAPS } = require('./config-attr');
const { genJSXObjectAst } = require('../../utils/astUtils');
const renderBuilder = require('../render-base/render-builder');
const traverse = require('../../utils/traverseNodePath');

const DYNAMIC_EVENTS = 'DYNAMIC_EVENTS';
const STATE_DATA = 'STATE_DATA';
const CSS_STYLES = 'CSS_STYLES';

function getMemberExpression(expression) {
  return expression.type === 'MemberExpression' ? expression.property.name : '';
}

function getVarExpression(expression) {
  return expression.type === 'Identifier' ? expression.name : '';
}

function traverseRenderAst(ast, context) {
  traverse(ast, {
    enter(path) {
      if (path.node.type === 'JSXAttribute') {
        // for onClick => onTap ; source => src;
        let attrName = path.node.name.name;
        path.node.name.name = ATTR_MAPS[attrName] || EVENT_MAPS[attrName] || attrName;

        if (path.node.name.name === 'ref') {
          path.remove();
        }
        if (attrName === 'className') {
          let labelName = path.parent.name.name;
          let className = path.node.value.value;
          context[CSS_STYLES][`.${className}`] = labelName;
        }
      }
      if (path.node && path.node.type === 'JSXExpressionContainer') {

        // for {this.props.name} => {{name}}
        if (path.node.expression.type === 'MemberExpression') {
          let bindName = getMemberExpression(path.node.expression);
          path.node.expression = genJSXObjectAst(bindName);
          context[STATE_DATA][bindName] = '';
        }

        // for {name} => {{name}}
        if (path.node.expression.type === 'Identifier') {
          let bindName = getVarExpression(path.node.expression);
          path.node.expression = genJSXObjectAst(bindName);
          context[STATE_DATA][bindName] = '';
        }

        // for {{test: name}} => {{name}}
        if (path.node.expression.properties && path.node.expression.properties.length === 1) {
          let property = path.node.expression.properties[0];
          if (property.value.type === 'Identifier') {
            let bindName = property.value.name;
            property.key.name = bindName;
            property.shorthand = true;
            property.extra = { shorthand: true };
            context[STATE_DATA][bindName] = '';
          }
          if (property.value.type === 'MemberExpression') {
            property.key.name = '___replace___';
            // todo parse "{{}}" string
          }

        }
      }
    }
  });
}

module.exports = renderBuilder({
  name: 'render-attr-plugin',
  parse(parsed, renderAst) {
    parsed[DYNAMIC_EVENTS] = [];
    parsed[STATE_DATA] = {};
    parsed[CSS_STYLES] = {};
    traverseRenderAst(renderAst, parsed);
  },
  generate(ret, parsed, options) {
  },
});
