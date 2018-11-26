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
  // preserveWhitespace: false, // default to undefined
  staticKeys: genStaticKeys(defaultModules)
};
