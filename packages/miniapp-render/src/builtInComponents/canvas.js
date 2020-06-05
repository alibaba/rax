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
  singleEvents: [{
    name: 'onCanvasTouchStart',
    eventName: 'canvastouchstart'
  },
  {
    name: 'onCanvasTouchMove',
    eventName: 'canvastouchmove'
  },
  {
    name: 'onCanvasTouchEnd',
    eventName: 'canvastouchend'
  },
  {
    name: 'onCanvasTouchCancel',
    eventName: 'canvastouchcancel'
  },
  {
    name: 'onCanvasLongTap',
    eventName: 'longtap'
  },
  {
    name: 'onCanvasError',
    eventName: 'error'
  }]
};
