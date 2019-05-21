const attrs = require('./attrs');
const tagName = require('./tagName');
const checked = require('./checked');
const template = require('./template');
const style = require('./style');

module.exports = function(mpType) {
  let list, bind, key, condition, events, webView;
  switch (mpType) {
    case 'weixin':
      list = require('./weapp/list');
      bind = require('./weapp/bind');
      key = require('./weapp/key');
      condition = require('./weapp/condition');
      events = require('./weapp/events');
      webView = require('./weapp/web-view');
      break;
    case 'alipay':
    default:
      list = require('./alipay/list');
      bind = require('./alipay/bind');
      key = require('./alipay/key');
      condition = require('./alipay/condition');
      events = require('./alipay/events');
      webView = require('./alipay/web-view');
  }
  /**
   * @NOTE:
   *   Modules are execed in order.
   *   if you wants to use a:for with `bind`, `condition`,
   *   and other rules at same time, must put `list` rule first.
   */
  return [list, style, events, key, condition, checked, bind, template, tagName, webView, attrs];
};

