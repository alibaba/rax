export default {
  name: 'camera',
  props: [{
    name: 'mode',
    get(domNode) {
      return domNode.getAttribute('mode') || 'normal';
    },
  }, {
    name: 'device-position',
    get(domNode) {
      return domNode.getAttribute('device-position') || 'back';
    },
  }, {
    name: 'flash',
    get(domNode) {
      return domNode.getAttribute('flash') || 'auto';
    },
  }, {
    name: 'frame-size',
    get(domNode) {
      return domNode.getAttribute('frame-size') || 'medium';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  singleEvents: [{
    name: 'onCameraStop',
    eventName: 'stop'
  },
  {
    name: 'onCameraError',
    eventName: 'error'
  },
  {
    name: 'onCameraInitDone',
    eventName: 'initdone'
  },
  {
    name: 'onCameraScanCode',
    eventName: 'scancode'
  }]
};
