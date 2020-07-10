export default {
  name: 'cover-image',
  props: [{
    name: 'src',
    get(domNode) {
      return domNode.src;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onCoverImageLoad',
    eventName: 'load'
  },
  {
    name: 'onCoverImageError',
    eventName: 'error'
  }]
};
