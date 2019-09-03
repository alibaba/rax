const chalk = require('chalk');
const babelMerge = require('babel-merge');

const defaultOptions = {
  disableJSXPlus: process.env.DISABLE_JSX_PLUS,
  styleSheet: false,
  hot: false,
};

let logOnce = true;

module.exports = (userOptions = {}) => {
  const options = Object.assign({}, defaultOptions, userOptions);
  const { hot, styleSheet, disableJSXPlus, custom = {} } = options;

  const baseConfig = {
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
          modules: 'auto',
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

  const configArr = [baseConfig];

  // Enable jsx plus default.
  if (!disableJSXPlus) {
    configArr.push({
      plugins: [
        require.resolve('babel-plugin-transform-jsx-list'),
        require.resolve('babel-plugin-transform-jsx-condition'),
        require.resolve('babel-plugin-transform-jsx-memo'),
        require.resolve('babel-plugin-transform-jsx-slot'),
        [require.resolve('babel-plugin-transform-jsx-fragment'), { moduleName: 'rax' }],
        require.resolve('babel-plugin-transform-jsx-class'),
      ],
    });

    if (logOnce) {
      console.log(chalk.green('[JSX+] Stynax enabled.'));
      logOnce = false;
    }
  }

  if (styleSheet) {
    configArr.push({
      plugins: [
        [require.resolve('babel-plugin-transform-jsx-stylesheet'), { retainClassName: true }]
      ]
    });
  }

  if (hot) {
    configArr.push({
      plugins: [require.resolve('rax-hot-loader/babel')],
    });
  }

  // merge custom config
  configArr.push(custom);

  const result = babelMerge.all(configArr);

  return result;
};
