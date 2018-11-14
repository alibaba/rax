const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');
const { isValidTag } = require('../config/tags');

module.exports = postcss.plugin('postcss-tag-prefix', function(options) {
  const prefix = options && options.prefix || 'a-';

  return function(root) {
    // append "a-"" prefix
    root.walkRules(rule => {
      if (rule.selector) {
        rule.selector = selectorParser(function(selectors) {
          selectors.walk(selector => {
            if (selector.type === 'tag' && isValidTag(selector.value)) {
              selector.value = prefix + selector.value;
            }
          });
        }).processSync(rule.selector);
      }
    });
  };
});
