import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'canvas',
  props: [{
    name: 'type',
    get(domNode) {
      return domNode.getAttribute('type') || '';
    },
  }, {
    name: 'canvasId',
    get(domNode) {
      return domNode.getAttribute('canvas-id') || '';
    },
  }, {
    name: 'disableScroll',
    get(domNode) {
      return !!domNode.getAttribute('disable-scroll');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onCanvasTouchStart(evt) {
      callSingleEvent('canvastouchstart', evt, this);
    },

    onCanvasTouchMove(evt) {
      callSingleEvent('canvastouchmove', evt, this);
    },

    onCanvasTouchEnd(evt) {
      callSingleEvent('canvastouchend', evt, this);
    },

    onCanvasTouchCancel(evt) {
      callSingleEvent('canvastouchcancel', evt, this);
    },
    onCanvasLongTap(evt) {
      callSingleEvent('longtap', evt, this);
    },
    onCanvasError(evt) {
      callSingleEvent('error', evt, this);
    },
  },
};
