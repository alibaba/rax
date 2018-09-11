const { parse } = require('./parser');
const { generate } = require('./codegen');
const { createCompilerCreator } = require('./create-compiler');
const createRenderFn = require('./codegen/createRenderFn');
const withScope = require('./codegen/withScope');
const { baseOptions } = require('./options');

/**
 * template: string
 * options: compilerOption
 */
exports.createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  const ast = parse(template.trim(), options);
  const code = generate(ast, options);

  return {
    ast: ast,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});

exports.createRenderFn = createRenderFn;
exports.baseOptions = baseOptions;
exports.withScope = withScope;
exports.parse = parse;
exports.generate = generate;
