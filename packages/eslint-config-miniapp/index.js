module.exports = {
  parserOptions: {
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    },
    sourceType: 'module',
  },
  env: {
    es6: true,
  },
  plugins: ['es', 'prototype'],
  rules: {
    'es/no-object-getownpropertysymbols': 'error',
    'es/no-object-setprototypeof': 'error',
    'es/no-number-isnan': 'error',
    'es/no-number-issafeinteger': 'error',
    'es/no-number-parsefloat': 'error',
    'es/no-number-parseint': 'error',
    'es/no-string-raw': 'error',
    'es/no-string-fromcodepoint': 'error',
    'prototype/no-string-methods': ['error', ['normalize']],
    'prototype/no-array-methods': ['error', ['copyWithin', 'keys', 'values', 'entries']],
    'es/no-weak-set': 'error',
    'es/no-proxy': 'error',
    'es/no-reflect': 'error',
    'es/no-symbol': 'error',
  },
};
