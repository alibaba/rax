const { getRootEl, getAndRemoveAttr } = require('../helpers');

const IS_BIND_REG = /\W*\{\{/;
const WEBVIEW_TAG = 'web-view';

function transformNode(el, state) {
  const rootEl = getRootEl(el);
  const { src } = el.attrsMap;

  if (el.tag === WEBVIEW_TAG) {
    rootEl.isWebView = true;

    const srcExp = getAndRemoveAttr(el, 'src');
    if (IS_BIND_REG.test(src)) {
      rootEl.webViewSrc = srcExp;
    } else {
      rootEl.webViewSrc = JSON.stringify(srcExp);
    }
  }
}

module.exports = {
  transformNode,
};
