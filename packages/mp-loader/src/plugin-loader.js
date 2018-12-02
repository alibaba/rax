const { getOptions } = require('loader-utils');

const REQUIRE_PLUGIN = '__REQUIRE_PLUGIN__';

module.exports = function() {
  const { type, path } = getOptions(this) || {};
  return `module.exports = typeof ${REQUIRE_PLUGIN} === 'function' ? ${REQUIRE_PLUGIN}('${type}', '${path}') : null;`;
};
