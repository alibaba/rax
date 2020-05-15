import callSingleEvent from '../events/callSingleEvent';

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
      callSingleEvent('submit', evt, this);
    },
    onFormReset(evt) {
      callSingleEvent('reset', evt, this);
    },
  },
};
