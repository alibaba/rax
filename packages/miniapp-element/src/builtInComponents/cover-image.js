import callSingleEvent from '../events/callSingleEvent';

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
      callSingleEvent('load', evt, this);
    },
    onCoverImageError(evt) {
      callSingleEvent('error', evt, this);
    },
  },
};
