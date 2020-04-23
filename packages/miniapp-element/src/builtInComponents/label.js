import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'label',
  props: [{
    name: 'for',
    get(domNode) {
      return domNode.getAttribute('for') || '';
    },
  }],
  handles: {},
};
