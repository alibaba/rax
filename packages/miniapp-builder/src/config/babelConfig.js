module.exports = {
  babelrc: false,
  sourceMaps: true,
  presets: [
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          chrome: '49',
          ios: '8'
        },
        modules: 'commonjs'
      }
    ]
  ],
  parserOpts: {
    /**
     * During loader process, user content JS may contains import statement,
     * which may be wrapped at a function scope.
     */
    allowImportExportEverywhere: true,
  },
  plugins: [
    [
      require.resolve('../plugins/BabelPluginRootImport'),
      {
        rootPathPrefix: '/',
      },
    ],
    // Stage 0
    require.resolve('@babel/plugin-proposal-function-bind'),
    // Stage 1
    require.resolve('@babel/plugin-proposal-export-default-from'),
    require.resolve('@babel/plugin-proposal-logical-assignment-operators'),
    [
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      { loose: false },
    ],
    [
      require.resolve('@babel/plugin-proposal-pipeline-operator'),
      { proposal: 'minimal' },
    ],
    [
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      { loose: false },
    ],
    require.resolve('@babel/plugin-proposal-do-expressions'),
    // Stage 2
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-function-sent'),
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    require.resolve('@babel/plugin-proposal-numeric-separator'),
    require.resolve('@babel/plugin-proposal-throw-expressions'),
    // Stage 3
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    require.resolve('@babel/plugin-syntax-import-meta'),
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: false },
    ],
    require.resolve('@babel/plugin-proposal-json-strings'),
  ],
};
