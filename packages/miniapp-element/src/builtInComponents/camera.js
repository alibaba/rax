export default {
  name: 'camera',
  props: [{
    name: 'mode',
    get(domNode) {
      return domNode.getAttribute('mode') || 'normal';
    },
  }, {
    name: 'devicePosition',
    get(domNode) {
      return domNode.getAttribute('device-position') || 'back';
    },
  }, {
    name: 'flash',
    get(domNode) {
      return domNode.getAttribute('flash') || 'auto';
    },
  }, {
    name: 'frameSize',
    get(domNode) {
      return domNode.getAttribute('frame-size') || 'medium';
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onCameraStop(evt) {
      this.callSimpleEvent('stop', evt);
    },
    onCameraError(evt) {
      this.callSimpleEvent('error', evt);
    },
    onCameraInitDone(evt) {
      this.callSimpleEvent('initdone', evt);
    },
    onCameraScanCode(evt) {
      this.callSimpleEvent('scancode', evt);
    },
  },
};
