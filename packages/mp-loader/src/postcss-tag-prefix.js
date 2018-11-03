const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

module.exports = postcss.plugin('postcss-tag-prefix', function(options) {
  const prefix = options && options.prefix || 'a-';

  return function(root) {
    // append "a-"" prefix
    root.walkRules(rule => {
      if (rule.selector) {
        rule.selector = selectorParser(function(selectors) {
          selectors.walk(selector => {
            if (selector.type === 'tag') {
              selector.value = prefix + selector.value;
            }
          });
        }).processSync(rule.selector);
      }
    });
  };
});
