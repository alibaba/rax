const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

const VALID_TAG_REG = /^[a-z](?:[\-\.0-9_a-z\xB7\xC0-\xD6\xD8-\xF6\xF8-\u037D\u037F-\u1FFF\u200C\u200D\u203F\u2040\u2070-\u218F\u2C00-\u2FEF\u3001-\uD7FF\uF900-\uFDCF\uFDF0-\uFFFD]|[\uD800-\uDB7F][\uDC00-\uDFFF])*$/;

module.exports = postcss.plugin('postcss-tag-prefix', function(options) {
  const prefix = options && options.prefix || 'a-';
  return function(root) {
    // append "a-" prefix
    root.walkRules(rule => {
      /**
       * Keyframes rule should not be prefixed,
       * but other atRule should.
       *   should not prefix:
       *     @keyframes foo {
       *       from {}
       *       to {}
       *     }
       *   should prefix:
       *     @media screen (width < 100px) {
       *       image {}
       *     }
       */
      if (rule.parent.type === 'atrule' && rule.parent.name === 'keyframes') {
        return;
      }
      rule.selector = selectorParser(function addPrefixToTag(node) {
        node.walk(selector => {
          if (selector.type !== 'selector') {
            return;
          }

          selector.nodes.forEach((node) => {
            if (node.type !== 'tag') {
              return;
            }
            /**
             * Prefix tags
             *   should be prefixed. eg:
             *     .foo:not(image) {}
             *   should not be prefixed. eg:
             *     .foo:nth-child(3n) {}
             */
            if (isValidTag(node.value)) {
              node.value = prefix + node.value;
            }
          });
        });
      }).processSync(rule.selector);
    });
  };
});

function isValidTag(tagName) {
  return VALID_TAG_REG.test(tagName);
}
