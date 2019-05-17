/**************************************************
 * Created by kaili on 2019/5/16 下午5:26.
 **************************************************/
const { TAG_MAPS } = require('./config-tag');
const t = require('@babel/types');
const renderBuilder = require('../render-base/render-builder');
const traverse = require('../../utils/traverseNodePath');
const generate = require('@babel/generator').default;
const chalk = require('chalk');
const TEMPLATE_AST = 'templateAST';

function traverseRenderAst(ast) {
  traverse(ast, {
    enter(path) {
      if (path.node.type === 'JSXElement') {
        let openTagName = path.node.openingElement.name.name;
        path.node.openingElement.name.name = TAG_MAPS[openTagName] || openTagName;

        if (path.node.closingElement) {
          let closeTagName = path.node.closingElement.name.name;
          path.node.closingElement.name.name = TAG_MAPS[closeTagName] || closeTagName;
        }
      }
    }
  });
}

module.exports = renderBuilder({
  name: 'render-tag-plugin',
  parse(parsed, renderAst) {
    traverseRenderAst(renderAst);
  },
  generate(ret, parsed, options) {
  }
});
