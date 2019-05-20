const { baseOptions, generate } = require('sfc-compiler');

exports.createGenerate = function(modules) {
  return function(ast, opts) {
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
};
