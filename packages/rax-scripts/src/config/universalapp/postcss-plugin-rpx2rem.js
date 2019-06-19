const postcss = require('postcss');
const chalk = require('chalk');

/**
 * Replace rpx to rem.
 */
module.exports = postcss.plugin('postcss-plugin-rpx2rem', function(opts) {
  opts = opts || {};
  const multiple = opts.multiple || 100;
  const transform = (str) => parseFloat(str) / multiple + 'rem';
  // Work with options here
  return function(root) {
    // Transform CSS AST here
    root.walkRules(rule => {
      // rem / 100, rpx to rem.
      rule.replaceValues(/^(\d*\.?\d+)rem/ig, { fast: 'rem' }, transform);
      rule.replaceValues(/^(\d*\.?\d+)rpx/ig, { fast: 'rpx' }, transform);
      rule.replaceValues(/^(\d*\.?\d+)$/g, {}, (str) => {
        if (str !== '0') {
          console.log(chalk.yellow('Please use "rpx" to compitiable with 750 screen in following CSS definition.\n'));
          console.log(chalk.yellow(rule.toString()));
        }
        return str;
      });
    });
  };
});
