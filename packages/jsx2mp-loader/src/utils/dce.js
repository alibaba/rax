const { transformSync } = require('@babel/core');

const parserOpts = {
  plugins: [
    'classProperties',
    'jsx',
    'typescript',
    'trailingFunctionCommas',
    'asyncFunctions',
    'exponentiationOperator',
    'asyncGenerators',
    'objectRestSpread',
    ['decorators', { decoratorsBeforeExport: false }],
    'dynamicImport',
  ], // support all plugins
};

function eliminateDeadCode(source) {
  return transformSync(source, {
    parserOpts,
    plugins: [
      [
        require('babel-plugin-minify-dead-code-elimination'),
        {
          optimizeRawSize: true,
          keepFnName: true
        }
      ],
      [
        require('babel-plugin-danger-remove-unused-import'),
        {
          ignore: 'rax'
        }
      ]
    ]
  }).code;
}

module.exports = eliminateDeadCode;
