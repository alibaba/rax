const babelParser = require('@babel/parser');
const invokeModules = require('../utils/invokeModules');
const parserOption = require('./option');

/**
 * Parse JS code by babel parser.
 * @param code {String} JS code.
 */
function astParser(code) {
  return babelParser.parse(code, parserOption);
}

/**
 * @param code
 * @param options {Object} Parser options.
 */
function parse(code, options) {
  const ast = astParser(code);
  const imported = getImported(ast);
  const defaultExportedPath = getExportedPath(ast);

  const ret = {
    ast,
    imported,
    defaultExportedPath,
  };
  invokeModules(options.modules, ret, 'parse');

  return ret;
}

exports.parse = parse;
