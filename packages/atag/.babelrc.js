module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: 'iOS >= 8',
      },
    ],
  ],
  plugins: [
    '@babel/plugin-proposal-class-properties',
    [
      '@babel/plugin-transform-classes',
      {
        loose: true,
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-function-bind',
  ],
  env: {
    test: {
      plugins: ['istanbul'],
    },
  },
};
