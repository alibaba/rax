/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/text.html
 */
export default {
  PROPS: [{
    name: 'selectable',
    get(domNode) {
      return !!domNode.getAttribute('selectable');
    },
  }, {
    name: 'space',
    get(domNode) {
      return domNode.getAttribute('space') || '';
    },
  }, {
    name: 'decode',
    get(domNode) {
      return !!domNode.getAttribute('decode');
    },
  }],
  handles: {},
};
