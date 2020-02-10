import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'live-pusher',
  props: [{
    name: 'url',
    get(domNode) {
      return domNode.getAttribute('url');
    },
  }, {
    name: 'mode',
    get(domNode) {
      return domNode.getAttribute('mode') || 'RTC';
    },
  }, {
    name: 'autopush',
    get(domNode) {
      return !!domNode.getAttribute('autopush');
    },
  }, {
    name: 'muted',
    get(domNode) {
      return !!domNode.getAttribute('muted');
    },
  }, {
    name: 'enableCamera',
    get(domNode) {
      const value = domNode.getAttribute('enable-camera');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'autoFocus',
    get(domNode) {
      const value = domNode.getAttribute('auto-focus');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'orientation',
    get(domNode) {
      return domNode.getAttribute('orientation') || 'vertical';
    },
  }, {
    name: 'beauty',
    get(domNode) {
      return +domNode.getAttribute('beauty') || 0;
    },
  }, {
    name: 'whiteness',
    get(domNode) {
      return +domNode.getAttribute('whiteness') || 0;
    },
  }, {
    name: 'aspect',
    get(domNode) {
      return domNode.getAttribute('aspect') || '9:16';
    },
  }, {
    name: 'minBitrate',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('min-bitrate'), 10);
      return !isNaN(value) ? value : 200;
    },
  }, {
    name: 'maxBitrate',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('max-bitrate'), 10);
      return !isNaN(value) ? value : 1000;
    },
  }, {
    name: 'waitingImage',
    get(domNode) {
      return domNode.getAttribute('waiting-image') || '';
    },
  }, {
    name: 'waitingImageHash',
    get(domNode) {
      return domNode.getAttribute('waiting-image-hash') || '';
    },
  }, {
    name: 'zoom',
    get(domNode) {
      return !!domNode.getAttribute('zoom');
    },
  }, {
    name: 'devicePosition',
    get(domNode) {
      return domNode.getAttribute('device-position') || 'front';
    },
  }, {
    name: 'backgroundMute',
    get(domNode) {
      return !!domNode.getAttribute('background-mute');
    },
  }, {
    name: 'mirror',
    get(domNode) {
      return !!domNode.getAttribute('mirror');
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onLivePusherStateChange(evt) {
      callSimpleEvent('statechange', evt, this.domNode);
    },
    onLivePusherNetStatus(evt) {
      callSimpleEvent('netstatus', evt, this.domNode);
    },
    onLivePusherError(evt) {
      callSimpleEvent('error', evt, this.domNode);
    },
    onLivePusherBgmStart(evt) {
      callSimpleEvent('bgmstart', evt, this.domNode);
    },
    onLivePusherBgmProgress(evt) {
      callSimpleEvent('bgmprogress', evt, this.domNode);
    },
    onLivePusherBgmComplete(evt) {
      callSimpleEvent('bgmcomplete', evt, this.domNode);
    },
  },
};
