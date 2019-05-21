const wxConsts = {
  IS_DETECTIVE: /^wx\:/,
  IF_ATTRIBUTES: {
    IF: 'wx:if',
    ELSE_IF: 'wx:elif',
    ELSE: 'wx:else'
  },
  LISTENER_ACTION: 'bind',
  ATTR_KEY: 'wx:key',
  FOR_ATTRIBUTES: {
    FOR: 'wx:for',
    FOR_ITEM: 'wx:for-item',
    FOR_IDX: 'wx:for-index'
  },
  MESSAGE_ATTRIBUTE: 'bindmessage'
};

const alipayConsts = {
  IS_DETECTIVE: /^a\:/,
  IF_ATTRIBUTES: {
    IF: 'a:if',
    ELSE_IF: 'a:elif',
    ELSE: 'a:else'
  },
  LISTENER_ACTION: 'on',
  ATTR_KEY: 'a:key',
  FOR_ATTRIBUTES: {
    FOR: 'a:for',
    FOR_ITEM: 'a:for-item',
    FOR_IDX: 'a:for-index'
  },
  MESSAGE_ATTRIBUTE: 'onMessage'
};

let adapterInstance;

class Adapter {
  constructor(type) {
    switch (type) {
      case 'weixin':
        this.consts = wxConsts;
        break;
      case 'alipay':
      default:
        this.consts = alipayConsts;
        break;
    }
  }
};

module.exports = function(type = 'alipay') {
  if (!adapterInstance) {
    return adapterInstance = new Adapter(type);
  }
  return adapterInstance;
};
