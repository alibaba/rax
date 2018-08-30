const { createCompiler } = require('sfc-compiler');
const { baseOptions, createRenderFn } = require('sfc-compiler');

const compiler = createCompiler(baseOptions);


export function compile(template) {
  const { ast, render, staticRenderFns, errors, tips } = compiler.compile(template);
  return {
    ast,
    render,
    renderFn: createRenderFn(render, ast.tagHelperMap)
  };
}
