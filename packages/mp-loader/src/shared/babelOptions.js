module.exports = {
  presets: [
    require('@babel/preset-env'),
  ],
  plugins: [
    [require('babel-plugin-root-imports'), {
      rootPathPrefix: '/',
      rootPathSuffix: process.cwd(),
    }],

    // Stage 0
    require('@babel/plugin-proposal-function-bind'),

    // Stage 1
    require('@babel/plugin-proposal-export-default-from'),
    require('@babel/plugin-proposal-logical-assignment-operators'),
    [require('@babel/plugin-proposal-optional-chaining'), { 'loose': false }],
    [require('@babel/plugin-proposal-pipeline-operator'), { 'proposal': 'minimal' }],
    [require('@babel/plugin-proposal-nullish-coalescing-operator'), { 'loose': false }],
    require('@babel/plugin-proposal-do-expressions'),

    // Stage 2
    [require('@babel/plugin-proposal-decorators'), { 'legacy': true }],
    require('@babel/plugin-proposal-function-sent'),
    require('@babel/plugin-proposal-export-namespace-from'),
    require('@babel/plugin-proposal-numeric-separator'),
    require('@babel/plugin-proposal-throw-expressions'),

    // Stage 3
    require('@babel/plugin-syntax-dynamic-import'),
    require('@babel/plugin-syntax-import-meta'),
    [require('@babel/plugin-proposal-class-properties'), { 'loose': false }],
    require('@babel/plugin-proposal-json-strings')
  ]
};
