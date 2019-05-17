/**************************************************
 * Created by kaili on 2019/3/27 下午6:01.
 **************************************************/
const t = require('@babel/types');
const generate = require('@babel/generator').default;
const chalk = require('chalk');
const { parseAstBody } = require('../../utils/parserUtils');
const { getJsxMapFnBody, replaceAssign } = require('../../utils/astUtils');
const renderBuilder = require('../render-base/render-builder');
const traverse = require('../../utils/traverseNodePath');

const TEMPLATE_AST = 'templateAST';

function traverseRenderAst(ast) {
  traverse(ast, {
    enter(path) {
      let callExp = null;
      let jsxExp = null;
      let jsxInsert = null;
      let logicExp = '';
      let InsertExp = '';
      let node = path.node;

      if (node.type === 'JSXExpressionContainer') {
        //逻辑表达式 list && list.length > 0 && list.map(item => <View/>) || aa && <View/>
        if (node.expression.type === 'LogicalExpression') {
          logicExp = node.expression.left;
          logicExp = ` a:if="{{${generate(logicExp).code}}}"`;
          if (node.expression.right.type === 'CallExpression') {
            callExp = node.expression.right;
          }
          if (node.expression.right.type === 'JSXElement') {
            jsxExp = node.expression.right;
          }
        }
        //三元表达式 list ? '<View style={{width: 750,border: 2}}>HAHAHA</View>':'<View style={{width: 750,border: 2}}>HAHAHA</View>';
        if (node.expression.type === 'ConditionalExpression') {
          logicExp = node.expression.test;
          logicExp = ` a:if="{{${generate(logicExp).code}}}"`;
          InsertExp = `a:elif`;
          if (node.expression.consequent.type === 'JSXElement') {
            jsxExp = node.expression.consequent;
          }
          if (node.expression.alternate.type === 'JSXElement') {
            jsxInsert = node.expression.alternate;
            if (node.expression.consequent.type === 'NullLiteral') {
              jsxExp = node.expression.consequent;
            }
          }
        }
        //调用表达式 list.map(item => <View/>)
        if (node.expression.type === 'CallExpression') {
          callExp = node.expression;
        }
        //替换节点
        if (jsxExp) {
          let jsxBlock = parseAstBody('<block ' + logicExp + '></block>').expression;
          jsxBlock.children.push(jsxExp);
          replaceAssign(path.node, jsxBlock);
        }
        //插入同级节点
        if (jsxInsert) {
          let insert = parseAstBody('<block ' + InsertExp + '></block>').expression;
          insert.children.push(jsxInsert);
          path.insertAfter(insert);
        }
        if (
          callExp
          && callExp.callee.type === 'MemberExpression'
          && callExp.callee.property.type === 'Identifier'
          && callExp.callee.property.name === 'map'
        ) {
          let fnBody = getJsxMapFnBody(callExp.arguments[0]);//获取.
          let logicExp = !!fnBody.iftest ? ` a:if="{{${generate(fnBody.iftest).code}}}"` : '';
          let calleeName = callExp.callee.object.name || callExp.callee.object.property.name;
          let code = '<block  a:for="{{' + calleeName + '}}" a:for-index="' + fnBody.itemIndex + '" a:for-item="' + fnBody.itemName + '"></block>';
          let jsxBlock = parseAstBody(code).expression;
          let fnbodys = callExp.arguments[0].body.body;
          if (logicExp) {
            fnbodys.forEach((item) => {
              let ifCode = item.consequent && generate(item.consequent.body[0].argument.openingElement).code;
              let elseCode = item.alternate && generate(item.alternate.body[0].argument).code;
              jsxBlock.children.push(parseAstBody('<block ' + logicExp + '>' + ifCode + '</block>').expression);
              !!item.alternate && jsxBlock.children.push(parseAstBody('<block a:else>' + elseCode + '</block>').expression);
            });
          } else {
            jsxBlock.children.push(fnBody.jsx);
          }

          replaceAssign(path.node, jsxBlock);
        }
      }
    }
  });
}

module.exports = renderBuilder({
  name: 'render-logic-plugin',
  parse(parsed, renderAst) {
    traverseRenderAst(renderAst);
  },
  generate(ret, parsed, options) {
  },
});
