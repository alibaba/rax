module.exports = {
  'root': true,
  'parser': 'babel-eslint',
  'env': {
    'browser': true,
    'node': true,
    'es6': true,
    'jest': true,
    'commonjs': true
  },
  'globals': {
    'App': true,
    'Page': true,
    'getApp': true,
    'Component': true,
    'my': true
  },
  'parserOptions': {
    'sourceType': 'module',
    'ecmaVersion': 6,
    'ecmaFeatures': {
      'generators': true,
      'experimentalObjectRestSpread': true
    }
  },
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
      'capIsNewExceptions': ['App', 'Page', 'Component']
    }],
    'key-spacing': ['error', {
      'beforeColon': false,
      'afterColon': true
    }],
    'no-multi-spaces': 'error',
    'no-multiple-empty-lines': 'error',
    'no-new-object': 'error',
    'no-spaced-func': 'error',
    'no-trailing-spaces': 'error',
    'no-extra-parens': 'error',
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
    }]
  }
};
