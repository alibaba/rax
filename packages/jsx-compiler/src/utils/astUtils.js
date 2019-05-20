/**************************************************
 * Created by kaili on 2019/3/19 上午11:33.
 **************************************************/
const { parseAstBody } = require('./parserUtils');

/**
 * generate base ast for traverse
 */
function buildJSXExpressionAst(expressionAst) {
  return {
    'type': 'File',
    'program': {
      'type': 'Program',
      'sourceType': 'module',
      'interpreter': null,
      'body': [{
        'type': 'ExpressionStatement',
        'expression': expressionAst
      }],
      'directives': []
    },
  };
}

function replaceAssign(originObject, newObject) {
  let originKey = Object.keys(originObject);
  let newKeys = Object.keys(newObject);
  originKey.filter(key => !!~newKeys.indexOf(key)).forEach(key => delete originObject[key]);
  newKeys.forEach(key => originObject[key] = newObject[key]);
}

function getJsxMapFnBody(node) {
  if (node.type === 'FunctionExpression' || node.type === 'ArrowFunctionExpression') {
    let indexName = node.params[1] ? node.params[1].name : 'idx';
    if (node.body.type === 'BlockStatement') {
      let ret = node.body.body.find(o => o.type === 'ReturnStatement');
      let ift = node.body.body.find(o => o.type === 'IfStatement');
      let jsx = node.body;
      let iftest = null;
      if (ret) {
        jsx = node.body.body.find(o => o.type === 'ReturnStatement').argument;
      }
      if (ift) {
        let iftJsx = node.body.body.find(o => o.type === 'IfStatement').consequent.body;
        jsx = iftJsx.find(o => o.type === 'ReturnStatement').argument;
        iftest = node.body.body.find(o => o.type === 'IfStatement').test;
      }
      return {
        itemIndex: indexName,
        itemName: node.params[0].name,
        iftest: iftest,
        jsx: jsx
      };
    }
    return {
      itemIndex: indexName,
      itemName: node.params[0].name,
      jsx: node.body
    };
  }
}

function getJSXStringAst(name) {
  let ast = parseAstBody(`<view onTap="${name}"/>`);
  return ast.expression.openingElement.attributes[0].value;
}

function genJSXObjectAst(name) {
  let ast = parseAstBody(`<view onTap={{${name}}}/>`);
  return ast.expression.openingElement.attributes[0].value.expression;
}

/**
 *  Rax style default value auto complete
 */
function styleConvert(type) {
  let def = {
    border: '0 solid black', position: 'relative', boxSizing: 'border-box', display: 'flex',
    flexDirection: 'column', alignContent: 'flex-start', flexShrink: 0
  };
  const data = {
    view: def,
    image: Object.assign(def, { backgroundRepeat: 'no-repeat', backgroundPosition: 'center center' }),
    text: Object.assign(def, { whiteSpace: 'pre-wrap', display: 'block', overflow: 'hidden', textOverflow: 'ellipsis' }),
  };
  return data[type];
}

module.exports = {
  buildJSXExpressionAst,
  replaceAssign,
  getJsxMapFnBody,
  getJSXStringAst,
  genJSXObjectAst,
  styleConvert
};
