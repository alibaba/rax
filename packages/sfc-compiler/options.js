const {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace
} = require('./utils');

const modules = require('./modules');
const directives = require('./directives');
const { genStaticKeys } = require('sfc-shared-utils');
const { isUnaryTag, canBeLeftOpenTag } = require('./utils');

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
