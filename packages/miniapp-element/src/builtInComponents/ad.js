import callSingleEvent from '../events/callSingleEvent';

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
  handles: {
    onAdLoad(evt) {
      callSingleEvent('load', evt, this);
    },
    onAdError(evt) {
      callSingleEvent('error', evt, this);
    },
    onAdClose(evt) {
      callSingleEvent('close', evt, this);
    },
  },
};
