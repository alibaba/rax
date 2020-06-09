import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'official-account',
  props: [{
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onOfficialAccountLoad(evt) {
      callSingleEvent('load', evt, this);
    },
    onOfficialAccountError(evt) {
      callSingleEvent('error', evt, this);
    },
  },
};
