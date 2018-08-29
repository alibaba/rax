const modules = require('../transpile');
const { baseOptions, generate } = require('sfc-compiler');

module.exports = function(ast) {
  const options = Object.assign(
    {
      // 完全字符串节点
      originalTag: true,
    },
    baseOptions
  );
  if (options.modules) {
    options.modules = options.modules.concat(modules);
  } else {
    options.modules = modules;
  }
  const generated = generate(ast, options);

  return {
    ast,
    render: generated.render
  };
};
