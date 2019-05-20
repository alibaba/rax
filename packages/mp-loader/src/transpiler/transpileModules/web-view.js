const { getRootEl, getAndRemoveAttr } = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;
const WEBVIEW_TAG = 'web-view';

function transformNodeWrapper(messageAttribute) {
  return function(el) {
    const rootEl = getRootEl(el);
    const { src } = el.attrsMap;
    const onMessage = el.attrsMap[messageAttribute];
    if (el.tag === WEBVIEW_TAG) {
      rootEl.isWebView = true;

      const srcExp = getAndRemoveAttr(el, 'src');
      if (IS_BIND_REG.test(src)) {
        rootEl.webViewSrc = srcExp;
      } else {
        rootEl.webViewSrc = JSON.stringify(srcExp);
      }

      const onMessageExp = getAndRemoveAttr(el, 'onMessage');
      if (IS_BIND_REG.test(onMessage)) {
        rootEl.webViewOnMessage = onMessageExp;
      } else {
        rootEl.webViewOnMessage = JSON.stringify(onMessageExp);
      }
    }
  };
}

module.exports = {
  transformNodeWrapper,
};
