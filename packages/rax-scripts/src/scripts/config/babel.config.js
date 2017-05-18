module.exports = {
  presets: [require.resolve('babel-preset-es2015'), require.resolve('babel-preset-rax')],
  plugins: [require.resolve('rax-hot-loader/babel')]
};
