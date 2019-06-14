const babelParser = require('@babel/parser');

const parserOptions = {
  sourceType: 'module',
  plugins: [
    'classProperties',
    'jsx',
    'flow',
    'flowComment',
    'trailingFunctionCommas',
    'asyncFunctions',
    'exponentiationOperator',
    'asyncGenerators',
    'objectRestSpread',
    ['decorators', { decoratorsBeforeExport: false }],
    'dynamicImport'
  ],
};

module.exports = function parse(code) {
  return babelParser.parse(code, parserOptions);
};
