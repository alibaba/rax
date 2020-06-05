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
  singleEvents: [{
    name: 'onWebviewMessage',
    eventName: 'message'
  },
  {
    name: 'onWebviewLoad',
    eventName: 'load'
  },
  {
    name: 'onWebviewError',
    eventName: 'error'
  }]
};
