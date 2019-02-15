const { resolve } = require('path');
const { readFileSync } = require('fs');

const REGEXP = /^text!(.*)/;

function matchString(id) {
  return REGEXP.exec(id);
}

const matches = {};
module.exports = function string() {
  return {
    name: 'string',

    resolveId(importee, importer) {
      const match = matchString(importee);
      if (match) {
        const absolutePath = resolve(importer, '..', match[1]);
        matches[absolutePath] = readFileSync(absolutePath, 'utf-8');
        return absolutePath;
      }
    },

    transform(code, id) {
      if (matches[id]) {
        return {
          code: `export default ${JSON.stringify(matches[id])};`,
          map: { mappings: '' }
        };
      }
    }
  };
};
