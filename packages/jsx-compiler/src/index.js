const { generate } = require('./codegen');
const { parse } = require('./parser');
const { baseOptions } = require('./options');
const adapter = require('./adapter');

/**
 * @param template {String} Template string.
 * @param options {Object} Compiler options.
 */
function compile(template, options) {
  const type = options.platform && options.platform.type || 'ali';
  options.adapter = options.adapter || adapter[type];
  const parsed = parse(template.trim(), options);
  const generated = generate(parsed, options);
  const { ast, imported, exported } = parsed;
  return Object.assign({ ast, imported, exported }, generated);
}

module.exports = exports = compile;
exports.parse = parse;
exports.generate = generate;
exports.baseOptions = baseOptions;
