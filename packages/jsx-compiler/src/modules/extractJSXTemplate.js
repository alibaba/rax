const traverse = require('../utils/traverseNodePath');
const PARAM = 'templateJSX';
/**
 * Extract JSX template
 */
module.exports = {
  parse(parsed, code, options) {
    const { defaultExportedPath } = parsed;
    if (!defaultExportedPath) return;

    traverse(ast, {

    });
  },
  generate(ret, parsed, options) {
    ret.template = templateJSX;
  },
};

