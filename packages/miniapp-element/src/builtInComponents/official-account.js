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
      this.callSimpleEvent('load', evt);
    },
    onOfficialAccountError(evt) {
      this.callSimpleEvent('error', evt);
    },
  },
};
