export default {
  name: 'text',
  props: [{
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
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
