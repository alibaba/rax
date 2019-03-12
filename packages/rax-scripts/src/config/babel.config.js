const optionConfig = require('./option.config');

module.exports = {
  presets: [
    require.resolve('@babel/preset-flow'),
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          chrome: '49',
          ios: '8'
        },
        modules: optionConfig.type === 'miniprogram' ? 'commonjs' : 'auto',
        include: [
          'transform-computed-properties'
        ]
      }
    ]
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        'corejs': false,
        'helpers': false,
        'regenerator': true,
        'useESModules': false
      }
    ],
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    // Stage 0
    require.resolve('@babel/plugin-proposal-function-bind'),
    // Stage 1
    require.resolve('@babel/plugin-proposal-export-default-from'),
    [
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      { loose: false },
    ],
    [
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      { loose: false },
    ],
    // Stage 2
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    // Stage 3
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: false },
    ]
  ]
};
