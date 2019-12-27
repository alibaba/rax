/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/icon.html
 */
export default {
  PROPS: [{
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || '';
    },
  }, {
    name: 'size',
    get(domNode) {
      return domNode.getAttribute('size') || '23';
    },
  }, {
    name: 'color',
    get(domNode) {
      return domNode.getAttribute('color') || '';
    },
  }],
  handles: {},
};
