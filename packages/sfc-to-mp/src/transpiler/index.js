const parse = require('./parse');
const generate = require('./generate');
const modules = require('./modules');

const atagComponents = [
  'view',
  'scroll-view',
  'swiper',
  'text',
  'icon',
  'progress',
  'button',
  'form',
  'input',
  'textarea',
  'checkbox',
  'radio',
  'switch',
  'slider',
  'picker',
  'picker-view',
  'label',
  'image',
  'video',
  'audio',
  'map',
];

function isMiniappTag(tag) {
  return atagComponents.indexOf(tag) > -1;
}

const baseOptions = {
  modules,
  // @see https://github.com/vuejs/vue/blob/dev/packages/vue-template-compiler/build.js#L3095
  isReservedTag: function(tag) {
    return isMiniappTag(tag);
  },
};

/**
 * template transpile from sfc to mp
 */
module.exports = function transpile(content = '', opts = {}) {
  opts = Object.assign({}, baseOptions, opts);
  const { ast } = parse(content, opts);

  const { metadata, template } = generate(ast, opts);
  return {
    template,
    metadata,
    ast,
  };
};
