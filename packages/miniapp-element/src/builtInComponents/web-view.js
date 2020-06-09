import callSingleEvent from '../events/callSingleEvent';

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
      callSingleEvent('message', evt, this);
    },
    onWebviewLoad(evt) {
      callSingleEvent('load', evt, this);
    },
    onWebviewError(evt) {
      callSingleEvent('error', evt, this);
    },
  },
};
