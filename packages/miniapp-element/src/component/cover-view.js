/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/cover-view.html
 */
export default {
  PROPS: [{
    name: 'scrollTop',
    get(domNode) {
      const value = domNode.getAttribute('scroll-top');
      return value !== undefined && !isNaN(+value) ? +value : '';
    },
  }],
  handles: {},
};
