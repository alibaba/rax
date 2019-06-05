const t = require('@babel/types');
const traverse = require('../utils/traverseNodePath');

/**
 * Generate config for miniapp.
 */
module.exports = {
  parse(parsed, code, options) {
    if (options.type === 'app') {
      const config = parsed.config = {};
      traverse(parsed.defaultExportedPath, {
        ClassProperty(path) {
          const { node } = path;
          if (node.static && t.isIdentifier(node.key, { name: 'config' })) {
            Object.assign(config, convertAstExpressionToVariable(node.value));
          }
        }
      });
    } else if (options.type === 'page') {
      parsed.config = {};
    } else if (options.type === 'component') {
      parsed.config = { component: true };
    }
  },
  generate(ret, parsed, options) {
    const config = ret.config = parsed.config;
    if (parsed.usingComponents && Object.keys(parsed.usingComponents).length > 0) {
      config.usingComponents = parsed.usingComponents;
    }
  },
};

function convertAstExpressionToVariable(node) {
  if (t.isObjectExpression(node)) {
    const obj = {};
    const properties = node.properties;
    properties.forEach(property => {
      if (property.type === 'ObjectProperty' || property.type === 'ObjectMethod') {
        const key = convertAstExpressionToVariable(property.key);
        const value = convertAstExpressionToVariable(property.value);
        obj[key] = value;
      }
    });
    return obj;
  } else if (t.isArrayExpression(node)) {
    return node.elements.map(convertAstExpressionToVariable);
  } else if (t.isLiteral(node)) {
    return node.value;
  } else if (t.isIdentifier(node) || t.isJSXIdentifier(node)) {
    const name = node.name;
    return name === 'undefined'
      ? undefined
      : name;
  } else if (t.isJSXExpressionContainer(node)) {
    return convertAstExpressionToVariable(node.expression);
  }
}
