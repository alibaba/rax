const invokeModules = require('../utils/invokeModules');
const genCode = require('./genCode');

function generate(parsed, options) {
  const { code, map } = genCode(parsed.ast);
  const ret = {
    code, map,
    // config, template, style and others should be generated in plugin modules.
  };

  invokeModules(options.modules, 'generate', ret, parsed, options);
  return ret;
}


exports.generate = generate;
