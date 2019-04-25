module.exports = require('babel-jest').createTransformer({
  'presets': [
    '@babel/preset-env',
    ['@babel/preset-react', {
      'pragma': 'createElement',
      'pragmaFrag': 'Fragment'
    }]
  ]
});