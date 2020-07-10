export default {
  name: 'checkbox-group',
  props: [{
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }],
  singleEvents: [{
    name: 'onCheckboxChange',
    eventName: 'change'
  }]
};
