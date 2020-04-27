export default {
  name: 'picker-view-column',
  props: [{
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
