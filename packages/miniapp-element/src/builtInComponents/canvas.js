import callSimpleEvent from '../events/callSimpleEvent';

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
      this.callSimpleEvent('canvastouchstart', evt);
    },

    onCanvasTouchMove(evt) {
      this.callSimpleEvent('canvastouchmove', evt);
    },

    onCanvasTouchEnd(evt) {
      this.callSimpleEvent('canvastouchend', evt);
    },

    onCanvasTouchCancel(evt) {
      this.callSimpleEvent('canvastouchcancel', evt);
    },
    onCanvasLongTap(evt) {
      callSimpleEvent('longtap', evt, this.domNode);
    },
    onCanvasError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
  },
};
