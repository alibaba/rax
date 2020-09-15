const canvas = {
  name: 'canvas',
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

export default canvas;
