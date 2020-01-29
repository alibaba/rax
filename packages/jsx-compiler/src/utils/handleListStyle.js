const t = require('@babel/types');
const createBinding = require('./createBinding');
const CodeError = require('./CodeError');
const genExpression = require('../codegen/genExpression');
const handleValidIdentifier = require('./handleValidIdentifier');

/**
 * @param {NodePath} mapFnBodyPath - map function path
 * @param {NodePath} path - jsx attribute path
 * @param {Node} forItem - for item node
 * @param {string} originalIndex - original for index name
 * @param {string} renamedIndex - renamed index name
 * @param {Array} properties - map return properties
 * @param {object} dynamicStyle - dynamic style generator
 * @param {string} code - original code
 * @return {boolean} useCreateStyle
 * */
module.exports = function(mapFnBodyPath, path, forItem, originalIndex, renamedIndex, properties, dynamicStyle, code) {
  let useCreateStyle = false;
  const { node } = path;
  if (t.isJSXIdentifier(node.name, {
    name: 'style'
  })) {
    if (!t.isJSXExpressionContainer(node.value)) {
      if (node.value.__originalExpression) {
        node.value.__properties.properties.splice(node.value.__properties.index, 1);
        node.value = t.jsxExpressionContainer(node.value.__originalExpression);
      } else {
        throw new CodeError(code, node.value, node.loc,
          "Style property's value should be JSXExpressionContainer, like <View style={styles.container}></View>.");
      }
    }
    const valuePath = path.get('value');
    // Rename index node in expression
    const indexNodeVisitor = {
      Identifier(innerPath) {
        handleValidIdentifier(innerPath, () => {
          if (innerPath.node.name === originalIndex) {
            innerPath.node.name = renamedIndex;
          }
        });
      }
    };
    valuePath.traverse(indexNodeVisitor);
    if (mapFnBodyPath) {
      mapFnBodyPath.traverse(indexNodeVisitor);
    }
    useCreateStyle = true;
    const name = dynamicStyle.add(node.value.expression);
    properties.push(t.objectProperty(t.identifier(name), t.callExpression(t.identifier('__create_style__'), [node.value.expression])));
    const replaceNode = t.stringLiteral(
      createBinding(genExpression(t.memberExpression(forItem, t.identifier(name))))
    );
    // Record original expression
    replaceNode.__originalExpression = node.value.expression;
    node.value = replaceNode;
    // Record current properties info
    replaceNode.__properties = {
      properties,
      index: properties.length - 1
    };
  }
  return useCreateStyle;
};
