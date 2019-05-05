const { generate } = require('./codegen');
const { parse } = require('./parser');

/**
 * @param template {String} Template string.
 * @param options {Object} Compiler options.
 */
function compile(template, options) {
  const parsed = parse(template.trim(), options);
  const generated = generate(parsed, options);

  return Object.assign({ ast }, generated);
}

module.exports = exports = compile;
exports.parse = parse;
exports.generate = generate;
