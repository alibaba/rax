export default {
  name: 'cover-view',
  props: [{
    name: 'scrollTop',
    get(domNode) {
      const value = domNode.getAttribute('scroll-top');
      return value !== undefined && !isNaN(+value) ? +value : '';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
