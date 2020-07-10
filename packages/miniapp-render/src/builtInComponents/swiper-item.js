export default {
  name: 'swiper-item',
  props: [{
    name: 'item-id',
    get(domNode) {
      return domNode.getAttribute('item-id') || '';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }]
};
