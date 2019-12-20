/**
 * https://developers.weixin.qq.com/miniprogram/dev/component/movable-area.html
 */
export default {
  properties: [{
    name: 'scaleArea',
    get(domNode) {
      return !!domNode.getAttribute('scale-area');
    },
  }],
  handles: {},
};
