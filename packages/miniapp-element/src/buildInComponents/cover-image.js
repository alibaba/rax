export default {
  name: 'cover-image',
  props: [{
    name: 'src',
    get(domNode) {
      return domNode.src;
    },
  }],
  handles: {
    onCoverImageLoad(evt) {
      this.callSimpleEvent('load', evt);
    },

    onCoverImageError(evt) {
      this.callSimpleEvent('error', evt);
    },
  },
};
