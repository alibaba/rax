module.exports = {
  'presets': [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
      },
    ],
    ['@babel/preset-react', {
      'pragma': 'createElement'
    }]
  ]
};
