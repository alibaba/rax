/**
 * Extendable
 */
const parserAdapters = {
  'ali': {
    if: 'a:if',
    else: 'a:else',
    elseif: 'a:elif',
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'a:key',

    modulePathSuffix: '/lib/miniapp/index',

    view: {
      onClick: 'onTap',
      onLongPress: 'onLongTap',
      className: '__rax-view'
    },

    styleKeyword: false,
  },
  'wechat': {
    if: 'wx:if',
    else: 'wx:else',
    elseif: 'wx:elif',
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
    key: 'wx:key',

    modulePathSuffix: '/lib/miniapp-wx/index',
    view: {
      onClick: 'bindtap',
      onLongPress: 'bindlongpress',
      onTouchStart: 'bindtouchstart',
      onTouchEnd: 'bindtouchend',
      onTouchMove: 'bindtouchmove',
      onTouchCancel: 'bindtouchcancel',
      className: '__rax-view'
    },
    styleKeyword: true
  },
};

module.exports = parserAdapters;
