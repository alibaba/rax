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
