const generate = require('@babel/generator').default;
const t = require('@babel/types');
const renderBuilder = require('../render-base/render-builder');
const traverse = require('../../utils/traverseNodePath');
const { parseAst, parseAstExpression } = require('../../utils/parserUtils');
const { genJSXObjectAst, styleConvert } = require('../../utils/astUtils');
const DYNAMIC_STYLES = 'DYNAMIC_STYLES';
const pixelStyle = ['height', 'width', 'fontSize', 'border'];

function getStyleName(dynamicStyles) {
  const styleName = '_style';
  return styleName + dynamicStyles.length;
}

function traverseRenderAst(ast, context) {
  traverse(ast, {
    enter(path) {
      //for <view style={{width: 100}}/> => <view style={{_style0001}}> && let _style0 = {width: 100} this.setData({_statle0})
      if (path.node && path.node.type === 'JSXAttribute'
          && path.node.name.name === 'style'
          && path.node.value.type === 'JSXExpressionContainer'
          && path.node.value.expression.type === 'ObjectExpression' | path.node.value.expression.type === 'ArrayExpression') {
        let styleObjectExpression = path.node.value.expression;
        let defStyle = styleConvert(path.parent.name.name);
        if (styleObjectExpression.type === 'ArrayExpression') {
          let propertiesArr = [];
          styleObjectExpression.elements.forEach((ele) => {
            propertiesArr = propertiesArr.concat(ele.properties);
          });
          styleObjectExpression = {
            type: 'ObjectExpression',
            properties: propertiesArr
          };
        }
        let properties = styleObjectExpression.properties;
        for (let keys in defStyle) {
          let temp = properties.find(ele => ele.key.name === keys);
          if (!temp) {
            properties.push({
              type: 'ObjectProperty', method: true, shorthand: false, computed: false,
              key: { type: 'Identifier', name: keys },
              value: { type: 'StringLiteral', value: defStyle[keys] }
            });
          }
        }
        let expCode = generate(styleObjectExpression).code;
        let styleName = getStyleName(context[DYNAMIC_STYLES]);
        let styleAst = parseAst(`let ${styleName} =${expCode} `);

        traverse(styleAst, {
          enter(path) {
            if (
              path.node
              && path.node.type === 'ObjectProperty'
              && !!~pixelStyle.indexOf(path.node.key.name)
            ) {
              if (path.node.value.type !== 'StringLiteral') {
                path.node.shorthand = false;
                path.node.extra = { ...path.node.extra, shorthand: false };
                path.node.value = parseAstExpression(`${generate(path.node.value).code} +'rpx'`);
              }
            }
          }
        });
        context[DYNAMIC_STYLES].push(styleAst.program.body[0]);
        path.node.value.expression = genJSXObjectAst(styleName);
      }
    }
  });
}

module.exports = renderBuilder({
  name: 'render-style-plugin',
  parse(parsed, renderAst) {
    parsed[DYNAMIC_STYLES] = [];
    traverseRenderAst(renderAst, parsed);
  },
  generate(ret, parsed, options) {
    // todo parsed[DYNAMIC_STYLES] should be insert to appx didMount lifeCycle;
    // let code = generate(parsed[DYNAMIC_STYLES]).code;
  },
});
