import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'radio',
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
    onRadioChange(evt) {
      callSimpleEvent('change', evt, this.domNode);
    },
  },
};
