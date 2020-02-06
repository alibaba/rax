module.exports = {
  'extends': [
    'rax'
  ],
  'root': true,
  rules: {
    'import/no-unresolved': ['error', { 
      commonjs: true,
      ignore: [
        '**/examples/**',
        '**/scripts/**',
      ]
    }],
  }
};
