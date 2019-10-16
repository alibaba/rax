module.exports = function(ignoreModule) {
  const envOpt = {
    loose: true,
  };

  if (ignoreModule) {
    envOpt.modules = false;
  }

  return {
    presets: [
      '@babel/preset-flow',
      ['@babel/preset-env', envOpt],
      ['@babel/preset-react', {
        pragma: 'createElement'
      }]
    ],
    plugins: [
      '@babel/plugin-proposal-export-default-from',
      ['@babel/plugin-proposal-class-properties', { loose: false }],
      'babel-plugin-transform-jsx-stylesheet',
      ['@babel/plugin-proposal-decorators', { legacy: true }],
    ],
    ignore: [
      'src/generator/templates',
      '__mockc__',
      'dist'
    ],
  };
};
