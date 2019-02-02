const {
  isPreTag,
  mustUseProp,
  isReservedTag,
  getTagNamespace,
  isUnaryTag,
  canBeLeftOpenTag
} = require('./utils');


exports.baseOptions = {
  expectHTML: true,
  isPreTag,
  isUnaryTag,
  mustUseProp,
  canBeLeftOpenTag,
  isReservedTag,
  getTagNamespace,
  /**
   *  Whether add whitespace between tags.
   *  Rax prefer false to make it more similar to JSX
   */
  preserveWhitespace: false,

  /**
   * Trim text node whitespaces
   * @example
   * <text>
   *   hello world
   * </text>
   * if this flag is on, node will be: { type:3, tag: 'text', children: 'hello world' },
   * or node will be: { type:3, tag: 'text', children: '\n  hello world\n' }
   */
  trimTextWhitespace: true,
};
