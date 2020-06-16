export default {
  name: 'official-account',
  props: [{
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onOfficialAccountLoad',
    eventName: 'load'
  },
  {
    name: 'onOfficialAccountError',
    eventName: 'error'
  }]
};
