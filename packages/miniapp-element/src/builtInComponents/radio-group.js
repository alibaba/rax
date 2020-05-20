import callSingleEvent from '../events/callSingleEvent';

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
      callSingleEvent('change', evt, this);
    },
  },
};
