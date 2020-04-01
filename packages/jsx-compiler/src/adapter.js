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
    needTransformKey: false
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
    triggerRef: true
  },
  'quickapp': {
    platform: 'quickapp',
    if: 'if',
    else: 'else',
    elseif: 'elif',
    show: 'show',
    for: 'for',
    forItem: 'a:for-item',
    forIndex: 'a:for-index',
    key: 'key',
    ext: 'ux',
    div: {
      onClick: 'onclick',
      onLongPress: 'onlongpress',
      onTouchStart: 'ontouchstart',
      onTouchEnd: 'ontouchend',
      onTouchMove: 'ontouchmove',
      onTouchCancel: 'ontouchcancel',
      onAppear: 'onappear',
      onDisAppear: 'ondisappear',
      onBlur: 'onblur',
      onFocus: 'onfocus',
      onSwipe: 'onswipe',
      onResize: 'onresize',
      className: '__rax-view'
    },
    baseComponent: 'div',
    // Need transform style & class keyword
    styleKeyword: true,
    // Need transform onClick -> bindonclick
    needTransformEvent: false,
    // Need transform onClick -> bind-click
    singleFileComponent: true,
    slotScope: false
  },
};

module.exports = parserAdapters;
