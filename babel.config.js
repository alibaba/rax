module.exports = function(api) {
  // Cache the returned value forever and don't call this function again.
  if (api) api.cache(true);

  return {
    'presets': [
      '@babel/preset-flow',
      ['@babel/preset-env', {
        'loose': true,
      }],
      ['@babel/preset-react', {
        'pragma': 'createElement'
      }]
    ],
    'plugins': [
      '@babel/plugin-proposal-export-default-from',
      ['@babel/plugin-proposal-class-properties', { 'loose': false }],
      'babel-plugin-transform-jsx-stylesheet',
      ['@babel/plugin-proposal-decorators', { 'legacy': true }],
      '@babel/plugin-syntax-dynamic-import',
    ],
    'ignore': [
      'src/generator/templates',
      '__mockc__',
      'dist'
    ],
  };
};
