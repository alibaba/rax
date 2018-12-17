const {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
  genStaticKeys,
  isUnaryTag,
  canBeLeftOpenTag
} = require('./utils');

const defaultModules = [];
const directives = require('./directives');

exports.baseOptions = {
  expectHTML: true,
  modules: defaultModules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  // Whether add whitespace between tags.
  // Rax prefer false to make it more similar to JSX
  preserveWhitespace: false,
  staticKeys: genStaticKeys(defaultModules)
};
