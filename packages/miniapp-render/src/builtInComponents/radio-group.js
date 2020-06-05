export default {
  name: 'radio-group',
  props: [{
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }],
  singleEvents: [{
    name: 'onRadioChange',
    eventName: 'change'
  }]
};
