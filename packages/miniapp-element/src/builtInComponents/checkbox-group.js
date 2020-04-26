import callSimpleEvent from '../events/callSimpleEvent';

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
      callSimpleEvent('change', evt, this.domNode);
    },
  },
};
