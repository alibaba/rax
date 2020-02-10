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
    onCanvasLongTap(evt) {
      callSimpleEvent('longtap', evt, this.domNode);
    },
    onCanvasError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
  },
};
