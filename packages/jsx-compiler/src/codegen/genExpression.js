const generate = require('@babel/generator').default;

/**
 * @param expression {Expression}
 * @param overridesOption {Object}
 * @return {String}
 */
function generateExpression(expression, overridesOption = {}) {
  const { code } = generate(
    expression,
    overridesOption
  );
  return code;
}

module.exports = generateExpression;
