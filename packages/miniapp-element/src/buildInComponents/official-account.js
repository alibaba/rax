export default {
  name: 'official-account',
  props: [],
  handles: {
    onOfficialAccountLoad(evt) {
      this.callSimpleEvent('load', evt);
    },

    onOfficialAccountError(evt) {
      this.callSimpleEvent('error', evt);
    },
  },
};
