var eslintConfig = {
  'root': true,
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'jest': true,
    'commonjs': true
  },
  'plugins': [
    'react',
    'import'
  ],
  'settings': {
    'react': {
      'pragma': 'createElement', // Pragma to use, default to 'React'
      'pragmaFrag': 'Fragment'
    }
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 6,
    'ecmaFeatures': {
      'jsx': true,
      'generators': true,
      'experimentalObjectRestSpread': true
    }
  },
  'globals': [
    '__weex_data__',
    '__weex_options__',
    '__weex_downgrade__',
    '__weex_define__',
    '__weex_require__',
    'WXEnvironment',
    'webkitRequestAnimationFrame',
    'webkitCancelAnimationFrame',
    'jasmine',
    'React'
  ],

  'rules': {
    // ES6
    'prefer-const': 'off',
    'no-const-assign': 'error',
    'no-class-assign': 'error',
    'no-dupe-class-members': 'error',
    'rest-spread-spacing': 'error',
    'no-duplicate-imports': 'error',
    'no-useless-rename': 'error',
    'arrow-spacing': 'error',
    'no-useless-computed-key': 'error',
    'template-curly-spacing': 'error',
    'generator-star-spacing': ['error', {'before': false, 'after': true}],
    'yield-star-spacing': ['error', {'before': false, 'after': true}],
    'strict': ['off', 'global'],
    'global-strict': ['off', 'always'],
    'no-extra-strict': 'off',
    'no-shadow': 'off',
    'no-unused-vars': ['off', {
      'vars': 'local',
      'args': 'after-used',
      'varsIgnorePattern': 'createElement'
    }],
    'no-undef': 'error',
    'no-unused-expressions': 'off',
    'no-use-before-define': 'off',
    'yoda': 'off',
    'eqeqeq': 'off',
    'no-new': 'off',
    'consistent-return': 'off',
    'dot-notation': ['error', {
      'allowKeywords': true
    }],
    'no-extend-native': 'error',
    'no-native-reassign': 'error',
    'no-return-assign': 'off',
    'no-constant-condition': ['error', {
      'checkLoops': false
    }],
    'no-caller': 'error',
    'no-loop-func': 'off',

    // Node.js
    'no-console': 'off',
    'no-catch-shadow': 'error',
    'no-new-require': 'off',
    'no-mixed-requires': ['off', false],
    'no-path-concat': 'off',
    'handle-callback-err': 'off',

    'no-empty': 'off',
    'indent': ['error', 2, {
      'SwitchCase': 1
    }],
    'camelcase': ['off', {
      'properties': 'always'
    }],
    'quotes': ['error', 'single', 'avoid-escape'],
    'brace-style': ['error', '1tbs', {
      'allowSingleLine': false
    }],
    'comma-spacing': ['error', {
      'before': false,
      'after': true
    }],
    'comma-style': ['error', 'last'],
    'eol-last': 'off',
    'func-names': 'off',
    'new-cap': ['error', {
      'newIsCap': true
    }],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true
    }],
    'no-mixed-spaces-and-tabs': 'error',
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-object': 'error',
    'no-spaced-func': 'error',
    'no-tabs': 'error',
    'no-trailing-spaces': 'error',
    'no-extra-parens': ['error', 'all', { ignoreJSX: 'all' }],
    'padded-blocks': ['error', 'never'],
    'semi': 'error',
    'semi-spacing': 'error',
    'keyword-spacing': 'error',
    'space-before-blocks': 'error',
    'space-before-function-paren': ['error', 'never'],
    'space-infix-ops': 'error',
    'spaced-comment': ['error', 'always', {
      'line': {
        'markers': ['/'],
        'exceptions': ['-', '+']
      },
      'block': {
        'markers': ['!'],
        'exceptions': ['*'],
        'balanced': true
      }
    }],

    /**
     * Import
     */
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-extraneous-dependencies': [
      'error',
      {
        'peerDependencies': true,
        'devDependencies': [
          '**/scripts/*.js',
          '**/__tests__/*.js',
          '**/__tests__/**/*.js',
          '**/*.config.js',
          '**/config/*.js',
          '**/*.conf.js',
          '**/tests/*.test.js'
        ]
      }
    ],

    /**
     * React & JSX
     */
    'jsx-quotes': ['error', 'prefer-double'],
    'react/display-name': 'off',
    'react/jsx-boolean-value': ['off', 'always'],
    'react/jsx-no-bind': ['error', {
      'allowArrowFunctions': true
    }],
    'react/prefer-es6-class': 'error',
    'react/jsx-curly-spacing': 'error',
    'react/jsx-indent-props': ['error', 2], // 2 spaces indentation
    'react/jsx-no-duplicate-props': 'error',
    'react/jsx-no-undef': 'error',
    'react/jsx-tag-spacing': 'error',
    'react/jsx-no-comment-textnodes': 'error',
    'react/jsx-equals-spacing': 'error',
    'react/jsx-handler-names': 'off',
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    'react/no-is-mounted': 'error',
    'react/no-children-prop': 'error',
    'react/no-did-mount-set-state': 'error',
    'react/no-did-update-set-state': 'error',
    'react/no-unknown-property': 'off',
    'react/style-prop-object': 'error',
    'react/react-in-jsx-scope': 'error',
    'react/self-closing-comp': 'error',
    'react/sort-comp': ['off', {
      'order': [
        'lifecycle',
        '/^on.+$/',
        '/^(get|set)(?!(InitialState$|DefaultProps$|ChildContext$)).+$/',
        'everything-else',
        '/^render.+$/',
        'render'
      ]
    }]
  }
};

module.exports = function lint(type = 'component') {
  var CLIEngine = require('eslint').CLIEngine;
  var cli = new CLIEngine(eslintConfig);
  var report = cli.executeOnFiles(['src/']);
  var formatter = cli.getFormatter();
  console.log(formatter(report.results));
};