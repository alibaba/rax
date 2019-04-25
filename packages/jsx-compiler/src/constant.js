/**
 * Self closed tag, eg: <tag />
 */
exports.SELF_CLOSE_TAGS = new Set([
  'import',
  'input',
]);

exports.RAX_PACKAGE = 'rax';
exports.RAX_COMPONENT = 'Component';
exports.SAFE_RAX_COMPONENT = '__rax_component__';

exports.CREATE_COMPONENT = 'createComponent';
exports.SAFE_CREATE_COMPONENT = '__create_component__';

exports.EXPORTED_CLASS_DEF = '__class_def__';
exports.HELPER_RUNTIME = 'jsx2mp-runtime';

exports.SPACE_INDENT = ' '.repeat(2);
