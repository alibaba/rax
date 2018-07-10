const { createCompiler } = require('../../compiler');
const { baseOptions } = require('../../compiler/options');
const createRenderFn = require('../../compiler/codegen/createRenderFn');

const compiler = createCompiler(baseOptions);


export function compile(template) {
  const { ast, render, staticRenderFns, errors, tips } = compiler.compile(template);
  return {
    ast,
    render,
    renderFn: createRenderFn(render, ast.tagHelperMap)
  };
}
