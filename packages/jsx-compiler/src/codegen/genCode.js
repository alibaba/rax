const generate = require('@babel/generator').default;

const generateOptions = {
  comments: false, // Remove template comments.
  concise: true, // Reduce whitespace, but not to disable all.
};

/**
 * Generate code and map from babel ast.
 * @param ast
 */
function genCode(ast) {
  return generate(ast, generateOptions);
}

module.exports = genCode;
