/**
 * Entry for webpack
 */
module.exports = {
  // 'native/worker': require.resolve('../targets/native/worker'),
  // 'native/renderer': require.resolve('../targets/native/renderer'),

  'ide/index': require.resolve('../src/targets/ide/index'),
  // 'web/index': require.resolve('../targets/web'),
};
