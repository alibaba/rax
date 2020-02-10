import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'web-view',
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
    onWebviewMessage(evt) {
      callSimpleEvent('message', evt, this.domNode);
    },
    onWebviewLoad(evt) {
      callSimpleEvent('load', evt, this.domNode);
    },
    onWebviewError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
  },
};
