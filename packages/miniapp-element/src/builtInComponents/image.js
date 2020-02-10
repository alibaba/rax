import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'image',
  props: [{
    name: 'renderingMode',
    get(domNode) {
      return domNode.getAttribute('rendering-mode') || '';
    },
  }, {
    name: 'src',
    get(domNode) {
      return domNode.src;
    },
  }, {
    name: 'mode',
    get(domNode) {
      return domNode.getAttribute('mode') || 'scaleToFill';
    },
  }, {
    name: 'lazyLoad',
    get(domNode) {
      return !!domNode.getAttribute('lazy-load');
    },
  }, {
    name: 'showMenuByLongpress',
    get(domNode) {
      return !!domNode.getAttribute('show-menu-by-longpress');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onImageLoad(evt) {
      callSimpleEvent('load', evt, this.domNode);
    },
    onImageError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
  },
};
