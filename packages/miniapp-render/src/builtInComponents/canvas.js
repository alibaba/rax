export default {
  name: 'canvas',
  props: [{
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || '';
    },
  }, {
    name: 'canvasId',
    get(domNode) {
      return domNode.getAttribute('canvas-id') || '';
    },
  }, {
    name: 'disableScroll',
    get(domNode) {
      return !!domNode.getAttribute('disable-scroll');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }]
};
