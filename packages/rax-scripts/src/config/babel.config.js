const chalk = require('chalk');

const type = process.env.TYPE;
const disableJSXPlus = process.env.DISABLE_JSX_PLUS;

const config = {
  presets: [
    require.resolve('@babel/preset-flow'),
    [
      require.resolve('@babel/preset-env'),
      {
        targets: {
          chrome: '49',
          ios: '8'
        },
        loose: true,
        modules: type === 'miniprogram' ? 'commonjs' : 'auto',
        include: [
          'transform-computed-properties'
        ]
      }
    ],
    [
      require.resolve('@babel/preset-react'), {
        'pragma': 'createElement',
        'pragmaFrag': 'Fragment'
      }
    ]
  ],
  plugins: [
    [
      require.resolve('@babel/plugin-transform-runtime'),
      {
        'corejs': false,
        'helpers': false,
        'regenerator': true,
        'useESModules': false
      }
    ],
    require.resolve('@babel/plugin-syntax-dynamic-import'),
    // Stage 0
    require.resolve('@babel/plugin-proposal-function-bind'),
    // Stage 1
    require.resolve('@babel/plugin-proposal-export-default-from'),
    [
      require.resolve('@babel/plugin-proposal-optional-chaining'),
      { loose: true },
    ],
    [
      require.resolve('@babel/plugin-proposal-nullish-coalescing-operator'),
      { loose: true },
    ],
    // Stage 2
    [require.resolve('@babel/plugin-proposal-decorators'), { legacy: true }],
    require.resolve('@babel/plugin-proposal-export-namespace-from'),
    // Stage 3
    [
      require.resolve('@babel/plugin-proposal-class-properties'),
      { loose: true },
    ]
  ]
};

if (!disableJSXPlus) {
  // Enable jsx plus default.
  config.plugins.push(require.resolve('babel-plugin-transform-jsx-list'));
  config.plugins.push(require.resolve('babel-plugin-transform-jsx-condition'));
  config.plugins.push(require.resolve('babel-plugin-transform-jsx-memo'));
  config.plugins.push(require.resolve('babel-plugin-transform-jsx-slot'));
  config.plugins.push([require.resolve('babel-plugin-transform-jsx-fragment'), { moduleName: 'rax' }]);
  config.plugins.push(require.resolve('babel-plugin-transform-jsx-class'));
  console.log(chalk.green('[JSX+] Stynax enabled.'));
}

module.exports = config;
