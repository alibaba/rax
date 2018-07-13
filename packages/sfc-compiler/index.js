const { parse } = require('./parser');
// const { optimize } = require('./optimizer');
const { generate } = require('./codegen');
const { createCompilerCreator } = require('./create-compiler');

/**
 * template: string
 * options: compilerOption
 */
exports.createCompiler = createCompilerCreator(function baseCompile(
  template,
  options
) {
  const vueAST = parse(template.trim(), options);

  // optimize(ast, options);
  const code = generate(vueAST, options);

  return {
    ast: vueAST,
    render: code.render,
    staticRenderFns: code.staticRenderFns
  };
});
