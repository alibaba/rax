import callSimpleEvent from '../events/callSimpleEvent';

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
      callSimpleEvent('load', evt, this.domNode);
    },
    onAdError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
    onAdClose(evt) {
      callSimpleEvent('close', evt, this.domNode);
    },
  },
};
