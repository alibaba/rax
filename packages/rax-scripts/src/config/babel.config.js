module.exports = {
  'presets': [
    require.resolve('@babel/preset-flow'),
    require.resolve('@babel/preset-env'),
    [require.resolve('@babel/preset-react'), {
      'pragma': 'createElement'
    }]
  ],
  'plugins': [
    require.resolve('@babel/plugin-proposal-export-default-from'),
    [require.resolve('@babel/plugin-proposal-class-properties'), { 'loose': false }],
    require.resolve('babel-plugin-transform-jsx-stylesheet'),
    [require.resolve('@babel/plugin-proposal-decorators'), { 'legacy': true }],
    require.resolve('rax-hot-loader/babel')
  ]
};
