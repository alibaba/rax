/**
 * Babel parser option.
 */
module.exports = {
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
