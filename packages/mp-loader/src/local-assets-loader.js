const { relative } = require('path');

const FILE_SCHEMA_PREFIX = '__file_schema_prefix__';

module.exports = function() {
  const assetPath = `/${relative(this.rootContext, this.resourcePath)}`;
  return `
    var prefix = typeof ${FILE_SCHEMA_PREFIX} !== 'undefined' 
      ? ${FILE_SCHEMA_PREFIX}
      : '';
    module.exports = prefix + '${assetPath}';
  `;
};
