import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'checkbox',
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
  handles: {
    onCheckboxItemChange(evt) {
      callSingleEvent('change', evt, this);
    },
  },
};
