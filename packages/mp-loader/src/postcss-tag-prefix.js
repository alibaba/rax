const postcss = require('postcss');
const selectorParser = require('postcss-selector-parser');

const validTags = {
  audio: true,
  button: true,
  canvas: true,
  checkbox: true,
  'checkbox-group': true,
  icon: true,
  label: true,
  picker: true,
  'picker-view': true,
  'picker-view-column': true,
  radio: true,
  slider: true,
  text: true,
  video: true,
  image: true,
  input: true,
  map: true,
  'radio-group': true,
  swiper: true,
  'swiper-item': true,
  textarea: true,
  view: true,
  form: true,
  navigator: true,
  progress: true,
  'scroll-view': true,
  switch: true,
  'web-view': true,
  page: true
};

function isValidTag(tagName) {
  return validTags.hasOwnProperty(tagName);
}

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
