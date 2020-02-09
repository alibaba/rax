module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'iOS >= 8',
        loose: true,
        include: ['transform-computed-properties']
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
};
