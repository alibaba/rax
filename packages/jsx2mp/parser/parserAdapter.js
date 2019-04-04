/**
 * Extendable
 */
const parserAdapters = {
  'alipay': {
    if: 'a:if',
    else: 'a:else',
    elseif: 'a:elif',
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'a:key',
  },
};

module.exports = parserAdapters.alipay;
