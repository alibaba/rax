/**
 * Built in tags.
 */
exports.builtInTags = new Set([
  'audio',
  'button',
  'canvas',
  'checkbox',
  'checkbox-group',
  'icon',
  'label',
  'picker',
  'picker-view',
  'picker-view-column',
  'radio',
  'slider',
  'text',
  'video',
  'image',
  'input',
  'map',
  'radio-group',
  'swiper',
  'swiper-item',
  'textarea',
  'view',
  'form',
  'navigator',
  'progress',
  'scroll-view',
  'switch',
  'web-view',

  'import',
  'block',
]);

/**
 * Self closed tag, eg: <tag />
 */
exports.SELF_CLOSE_TAGS = new Set([
  'import',
  'input',
]);

exports.RAX_PACKAGE = 'rax';
exports.RAX_UMD_BUNDLE = 'rax/dist/rax.min.js';
exports.RAX_COMPONENT = 'Component';
exports.SAFE_RAX_COMPONENT = '__rax_component__';

exports.CREATE_COMPONENT = 'createComponent';
exports.SAFE_CREATE_COMPONENT = '__create_component__';

exports.EXPORTED_CLASS_DEF = '__class_def__';
exports.HELPER_COMPONENT = '/__helpers/component';

exports.SPACE_INDENT = ' '.repeat(2);
