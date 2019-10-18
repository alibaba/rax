const invokeModules = require('../utils/invokeModules');
const genCode = require('./genCode');
const { baseOptions } = require('../options');

function generate(parsed, options = baseOptions) {
  const { code, map } = genCode(parsed.ast, options);
  const ret = {
    code, map,
    // config, template, style and others should be generated in plugin modules.
  };

  invokeModules(options.modules, 'generate', ret, parsed, options);

  return ret;
}


exports.generate = generate;
