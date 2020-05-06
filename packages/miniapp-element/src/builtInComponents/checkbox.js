import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'checkbox',
  props: [{
    name: 'value',
    get(domNode) {
      return domNode.getAttribute('value') || '';
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
      callSimpleEvent('change', evt, this.domNode);
    },
  },
};
