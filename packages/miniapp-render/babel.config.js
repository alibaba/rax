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
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-runtime',
      {
        absoluteRuntime: false,
        corejs: false,
        helpers: true,
        regenerator: true,
        useESModules: false
      }
    ]
  ]
};
