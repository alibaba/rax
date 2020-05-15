import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'checkbox-group',
  props: [{
    name: 'name',
    get(domNode) {
      return domNode.getAttribute('name') || '';
    },
  }],
  handles: {
    onCheckboxChange(evt) {
      callSingleEvent('change', evt, this);
    },
  },
};
