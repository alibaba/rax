const generate = require('@babel/generator').default;
const invokeModules = require('../utils/invokeModules');

function generate(parsed, options) {
  const { ast } = parsed;

  const ret = {
    // template: genElement(),
    // jsCode: genCode(),
    style: '',
    config: {},
  };

  invokeModules(options.modules, ret, 'generate');
  return ret;
}


exports.generate = generate;
