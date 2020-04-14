import callSimpleEvent from '../events/callSimpleEvent';

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
  handles: {
    onCoverImageLoad(evt) {
      callSimpleEvent('load', evt, this.domNode);
    },
    onCoverImageError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
  },
};
