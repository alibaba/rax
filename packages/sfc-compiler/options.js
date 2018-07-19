const {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
  genStaticKeys,
  isUnaryTag,
  canBeLeftOpenTag
} = require('./utils');

const modules = require('./modules');
const directives = require('./directives');

exports.baseOptions = {
  expectHTML: true,
  modules,
  directives,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  staticKeys: genStaticKeys(modules)
};
