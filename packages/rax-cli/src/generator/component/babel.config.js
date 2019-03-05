module.exports = function (api) {
  // Cache the returned value forever and don't call this function again.
  if (api) api.cache(true);

  return {
    'presets': [
      '@babel/preset-env',
      [
        '@babel/preset-react',
        {
          'pragma': 'createElement'
        }
      ]
    ],
    'plugins': [
      'babel-plugin-transform-jsx-stylesheet',
    ],
    'ignore': [
      'src/generator/templates',
      '__mockc__',
      'dist'
    ]
  };
};
