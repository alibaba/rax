const componentCommonProps = {
  ali: {
    onClick: 'onTap',
  },
  wechat: {
    onClick: 'bindtap',
    onLongPress: 'bindlongpress',
    onTouchStart: 'bindtouchstart',
    onTouchEnd: 'bindtouchend',
    onTouchMove: 'bindtouchmove',
    onTouchCancel: 'bindtouchcancel',
  },
  bytedance: {
    onClick: 'bindtap',
    onLongPress: 'bindlongpress',
    onTouchStart: 'bindtouchstart',
    onTouchEnd: 'bindtouchend',
    onTouchMove: 'bindtouchmove',
    onTouchCancel: 'bindtouchcancel',
  }
};

/**
 * Extendable
 */
const parserAdapters = {
  'ali': {
    platform: 'ali',
    if: 'a:if',
    else: 'a:else',
    elseif: 'a:elif',
    for: 'a:for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'a:key',

    view: {
      ...componentCommonProps.ali,
      onLongPress: 'onLongTap',
      className: '__rax-view'
    },
    compatibleText: false,
    // Need transform style & class keyword
    styleKeyword: false,
    // Need transform onClick -> bindonclick
    needTransformEvent: false,
    slotScope: true,
    // Need transform key
    needTransformKey: false,
    // Handle rax-slider
    processSlider: false
  },
  'wechat': {
    platform: 'wechat',
    if: 'wx:if',
    else: 'wx:else',
    elseif: 'wx:elif',
    for: 'wx:for',
    forItem: 'wx:for-item',
    forIndex: 'wx:for-index',
    key: 'wx:key',

    view: {
      ...componentCommonProps.wechat,
      className: '__rax-view'
    },
    compatibleText: false,
    text: {
      ...componentCommonProps.ali,
      className: '__rax-text'
    },
    styleKeyword: true,
    needTransformEvent: true,
    slotScope: false,
    needTransformKey: true,
    triggerRef: true,
    processSlider: true
  },
  'bytedance': {
    platform: 'bytedance',
    if: 'tt:if',
    else: 'tt:else',
    elseif: 'tt:elif',
    for: 'tt:for',
    forItem: 'tt:for-item',
    forIndex: 'tt:for-index',
    key: 'tt:key',

    view: {
      ...componentCommonProps.bytedance,
      className: '__rax-view'
    },
    compatibleText: false,
    text: {
      ...componentCommonProps.ali,
      className: '__rax-text'
    },
    styleKeyword: true,
    needTransformEvent: true,
    slotScope: false,
    needTransformKey: true,
    triggerRef: true
  },
};

module.exports = parserAdapters;
