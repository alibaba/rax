export default {
  name: 'movable-area',
  props: [{
    name: 'scaleArea',
    get(domNode) {
      return !!domNode.getAttribute('scale-area');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
