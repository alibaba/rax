export default {
  name: 'radio',
  props: [{
    name: 'value',
    get(domNode) {
      return domNode.getAttribute('value') || '';
    },
  }, {
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }, {
    name: 'checked',
    get(domNode) {
      return domNode.getAttribute('checked') || false;
    },
  }, {
    name: 'disabled',
    get(domNode) {
      return domNode.getAttribute('disabled') || false;
    },
  }, {
    name: 'color',
    get(domNode) {
      return domNode.getAttribute('color') || '';
    },
  }],
  singleEvents: [{
    name: 'onRadioChange',
    eventName: 'change'
  }]
};
