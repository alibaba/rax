export default {
  name: 'form',
  props: [{
    name: 'report-submit',
    get(domNode) {
      return !!domNode.getAttribute('report-submit');
    },
  }, {
    name: 'report-submit-timeout',
    get(domNode) {
      return +domNode.getAttribute('report-submit-timeout') || 0;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onFormSubmit',
    eventName: 'submit'
  },
  {
    name: 'onFormReset',
    eventName: 'reset'
  }]
};
