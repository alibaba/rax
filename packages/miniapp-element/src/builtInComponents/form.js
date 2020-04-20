import callSimpleEvent from '../events/callSimpleEvent';

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
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onFormSubmit(evt) {
      callSimpleEvent('submit', evt, this.domNode);
    },
    onFormReset(evt) {
      callSimpleEvent('reset', evt, this.domNode);
    },
  },
};
