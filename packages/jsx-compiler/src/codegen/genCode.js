const generate = require('@babel/generator').default;
const generateOptions = {};

/**
 * Generate code and map from babel ast.
 * @param ast
 */
function genCode(ast) {
  return generate(ast, generateOptions);
}

module.exports = genCode;
