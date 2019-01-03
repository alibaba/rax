const { getOptions } = require('loader-utils');

const REQUIRE_PLUGIN = '__REQUIRE_PLUGIN__';

/**
 * Loader for miniprogram project to get a plugin.
 */
module.exports = function() {
  const { type, path } = getOptions(this) || {};

  const WARNING = process.env.NODE_ENV === 'development' ? `
  if (module.exports == null) console.error('[ERROR] Getting miniprogram plugin. Plugin type: "${type}" Plugin path: "${path}"');
` : '';

  return `module.exports = typeof ${REQUIRE_PLUGIN} === 'function' ? ${REQUIRE_PLUGIN}('${type}', '${path}') : null;` + WARNING;
};
