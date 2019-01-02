const {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
  isUnaryTag,
  canBeLeftOpenTag
} = require('./utils');

const directives = require('./directives');

exports.baseOptions = {
  expectHTML: true,
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
};
