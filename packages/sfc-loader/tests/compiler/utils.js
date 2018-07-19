const { createCompiler } = require('sfc-compiler');
const { baseOptions } = require('sfc-compiler/options');
const createRenderFn = require('sfc-compiler/codegen/createRenderFn');

const compiler = createCompiler(baseOptions);


export function compile(template) {
  const { ast, render, staticRenderFns, errors, tips } = compiler.compile(template);
  return {
    ast,
    render,
    renderFn: createRenderFn(render, ast.tagHelperMap)
  };
}
