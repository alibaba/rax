const generate = require('@babel/generator').default;
const renderBuilder = require('../render-base/render-builder');
const traverse = require('../../utils/traverseNodePath');
const { getJSXStringAst } = require('../../utils/astUtils');
const { EVENT_MAPS } = require('./config-attr');

const DYNAMIC_EVENTS = 'DYNAMIC_EVENTS';

function getFnName(dynamicEvents) {
  if (!dynamicEvents) {
    dynamicEvents = [];
  }
  const fnName = '_events';
  return fnName + dynamicEvents.length;
}

function isEventAttr(event) {
  return !!EVENT_MAPS[event];
}

function traverseRenderAst(ast, parsed) {
  traverse(ast, {
    enter(path) {
      // for <view onClick={()=>{let a=1;}}/> => <view onTap='_events0'});
      // for <view onClick={function (){ let a=1;}}/> => <view onTap='_events0'})
      // for <view onClick={this.onClick}/> => <view onTap='_events0'})
      if (path.node && path.node.type === 'JSXAttribute'
          && isEventAttr(path.node.name.name)
          && path.node.value.type === 'JSXExpressionContainer'
          && !!~['FunctionExpression', 'ArrowFunctionExpression'].indexOf(path.node.value.expression.type)) {
        let expression = path.node.value.expression;
        let fnName = getFnName(parsed[DYNAMIC_EVENTS]);
        let objectMethodAst = {
          ...expression,
          type: 'ObjectMethod', method: true, shorthand: false, computed: false, kind: 'method',
          key: { type: 'Identifier', name: fnName },
        };
        parsed[DYNAMIC_EVENTS].push(objectMethodAst);
        path.node.value = getJSXStringAst(fnName);
      }
      if (path.node && path.node.type === 'JSXAttribute'
          && isEventAttr(path.node.name.name)
          && path.node.value.type === 'JSXExpressionContainer'
          && path.node.value.expression.type === 'MemberExpression') {
        path.node.value = {
          type: 'StringLiteral', extra: null, value: path.node.value.expression.property.name
        };
      }
    }
  });
}

module.exports = renderBuilder({
  name: 'render-event-plugin',
  parse(parsed, renderAst) {
    parsed[DYNAMIC_EVENTS] = [];
    traverseRenderAst(renderAst, parsed);
  },
  generate(ret, parsed, options) {
    // let code = generate(parsed[DYNAMIC_EVENTS]).code;
  },
});
