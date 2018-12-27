const { relative } = require('path');

const FILE_SCHEMA_PREFIX = '__file_schema_prefix__';

function escapeWindowsSep(str) {
  return str.replace(/\\/g, '/');
}

module.exports = function() {
  const assetPath = `/${relative(this.rootContext, this.resourcePath)}`;
  return `
    var prefix = typeof ${FILE_SCHEMA_PREFIX} !== 'undefined' 
      ? ${FILE_SCHEMA_PREFIX}
      : '';
    module.exports = prefix + '${escapeWindowsSep(assetPath)}';
  `;
};
