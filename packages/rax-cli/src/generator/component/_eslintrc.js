module.exports = {
  extends: ['eslint-config-rax/react', 'eslint-config-rax/typescript'],
  globals: {},
  rules: {
    'import/no-extraneous-dependencies': false,
    '@typescript-eslint/explicit-function-return-type': false,
    '@typescript-eslint/no-namespace': false,
    '@typescript-eslint/no-explicit-any': false
  }
};
