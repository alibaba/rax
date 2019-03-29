const babelParser = require('@babel/parser');
const parserOption = require('./option');

/**
 * Parse JS code by babel parser.
 * @param code {String} JS code.
 */
function parse(code) {
  return babelParser.parse(code, parserOption);
}

exports.parse = parse;
exports.parseElement = require('./parseElement');
