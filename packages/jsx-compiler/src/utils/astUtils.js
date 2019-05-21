const { parseBody } = require('./parserUtils');

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

function getJSXString(name) {
  let ast = parseBody(`<view onTap="${name}" />`);
  return ast.expression.openingElement.attributes[0].value;
}

function genJSXObject(name) {
  let ast = parseBody(`<view onTap={{${name}}}/>`);
  return ast.expression.openingElement.attributes[0].value.expression;
}

module.exports = {
  // buildJSXExpressionAst,
  replaceAssign,
  getJsxMapFnBody,
  getJSXString,
  genJSXObject,
};
