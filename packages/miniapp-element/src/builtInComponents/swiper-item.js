export default {
  name: 'swiper-item',
  props: [{
    name: 'itemId',
    get(domNode) {
      return domNode.getAttribute('item-id') || '';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {},
};
