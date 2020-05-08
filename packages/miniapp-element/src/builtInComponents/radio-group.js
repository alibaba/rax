import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'radio-group',
  props: [{
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }],
  handles: {
    onRadioChange(evt) {
      callSimpleEvent('change', evt, this.domNode);
    },
  },
};
