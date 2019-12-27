/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/swiper-item.html
 */
export default {
  PROPS: [{
    name: 'itemId',
    get(domNode) {
      return domNode.getAttribute('item-id') || '';
    },
  }],
  handles: {},
};
