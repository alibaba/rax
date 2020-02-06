export default {
  name: 'web-view',
  props: [{
    name: 'src',
    get(domNode) {
      return domNode.src;
    },
  }],
  handles: {
    onWebviewMessage(evt) {
      this.callSimpleEvent('message', evt);
    },

    onWebviewLoad(evt) {
      this.callSimpleEvent('load', evt);
    },

    onWebviewError(evt) {
      this.callSimpleEvent('error', evt);
    },
  },
};
