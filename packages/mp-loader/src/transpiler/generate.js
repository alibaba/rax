const modules = require('./transpileModules');
const { baseOptions, generate } = require('sfc-compiler');

module.exports = function(ast, opts) {
  const options = Object.assign(
    {},
    baseOptions,
    {
      originalTag: true, // reserve original tag name
      modules
    },
    opts
  );

  const generated = generate(ast, options);

  return {
    ast,
    render: generated.render
  };
};
