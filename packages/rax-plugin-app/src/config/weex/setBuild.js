'use strict';

module.exports = (config, context) => {
  config.optimization
    .minimizer('uglify')
      .tap((args) => {
        args[0].sourceMap = false;
        return args;
      })
      .end();
};
