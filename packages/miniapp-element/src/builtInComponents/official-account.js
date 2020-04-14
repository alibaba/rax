import callSimpleEvent from '../events/callSimpleEvent';

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
      callSimpleEvent('load', evt, this.domNode);
    },
    onOfficialAccountError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
  },
};
