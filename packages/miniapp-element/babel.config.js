module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          esmodules: true,
        },
        loose: true,
        include: ['transform-computed-properties']
      }
    ]
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties'
  ]
};
