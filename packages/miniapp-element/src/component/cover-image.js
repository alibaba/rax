const mp = require('miniapp-render');

const {
  cache,
  tool,
} = mp.$$adapter;

/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/cover-image.html
 */
export default {
  PROPS: [{
    name: 'src',
    get(domNode) {
      const window = cache.getWindow(domNode.$$pageId);
      return domNode.src ? tool.completeURL(domNode.src, window.location.origin, true) : '';
    },
  }],
  handles: {
    onCoverImageLoad(evt) {
      this.callSimpleEvent('load', evt);
    },

    onCoverImageError(evt) {
      this.callSimpleEvent('error', evt);
    },
  },
};
