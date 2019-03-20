const parserOption = {
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

const generateOption = {};

exports.parserOption = parserOption;
exports.generateOption = generateOption;
