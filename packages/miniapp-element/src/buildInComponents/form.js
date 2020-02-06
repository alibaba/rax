export default {
  name: 'form',
  props: [{
    name: 'reportSubmit',
    get(domNode) {
      return !!domNode.getAttribute('report-submit');
    },
  }, {
    name: 'reportSubmitTimeout',
    get(domNode) {
      return +domNode.getAttribute('report-submit-timeout') || 0;
    },
  }],
  handles: {
    onFormSubmit(evt) {
      this.callSimpleEvent('submit', evt);
    },

    onFormReset(evt) {
      this.callSimpleEvent('reset', evt);
    },
  },
};
