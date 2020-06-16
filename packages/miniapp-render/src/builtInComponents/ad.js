export default {
  name: 'ad',
  props: [{
    name: 'unitId',
    get(domNode) {
      return domNode.getAttribute('unit-id') || '';
    },
  }, {
    name: 'adIntervals',
    get(domNode) {
      return +domNode.getAttribute('ad-intervals') || 0;
    }
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onAdLoad',
    eventName: 'load'
  },
  {
    name: 'onAdError',
    eventName: 'error'
  },
  {
    name: 'onAdClose',
    eventName: 'close'
  }]
};
