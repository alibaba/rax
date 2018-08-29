const { parse } = require('./parser');
const { generate } = require('./codegen');
const { createCompilerCreator } = require('./create-compiler');
const { uniqueInstanceID, warn } = require('./utils');
const createRenderFn = require('./codegen/createRenderFn');
const injectThisScope = require('./codegen/injectThisScope');
const baseOptions = require('./options');

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

exports.createRenderFn = createRenderFn;
exports.baseOptions = baseOptions;
exports.uniqueInstanceID = uniqueInstanceID;
exports.injectThisScope = injectThisScope;
exports.warn = warn;
exports.parse = parse;
exports.generate = generate;
