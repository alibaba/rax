module.exports = {
  'extends': [
    'rax'
  ],
  'root': true,
  'plugins': ['rax'],
  'rules': {
    'rax/no-implicit-dependencies': ['error', {
      'peerDependencies': true,
      'devDependencies': [
        '**/scripts/*.js',
        '**/scripts/**/*.js',
        '**/__tests__/*.js',
        '**/__tests__/**/*.js',
        '**/*.config.js',
        '**/config/*.js',
        '**/*.conf.js',
        '**/tests/*.test.js',
        '**/demo/**'
      ]
    }]
  }
};
