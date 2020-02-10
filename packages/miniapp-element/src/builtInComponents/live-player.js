import callSimpleEvent from '../events/callSimpleEvent';

export default {
  name: 'live-player',
  props: [{
    name: 'src',
    get(domNode) {
      return domNode.src;
    },
  }, {
    name: 'mode',
    get(domNode) {
      return domNode.getAttribute('mode') || 'live';
    },
  }, {
    name: 'autoplay',
    get(domNode) {
      return !!domNode.getAttribute('autoplay');
    },
  }, {
    name: 'muted',
    get(domNode) {
      return !!domNode.getAttribute('muted');
    },
  }, {
    name: 'orientation',
    get(domNode) {
      return domNode.getAttribute('orientation') || 'vertical';
    },
  }, {
    name: 'objectFit',
    get(domNode) {
      return domNode.getAttribute('object-fit') || 'contain';
    },
  }, {
    name: 'backgroundMute',
    get(domNode) {
      return !!domNode.getAttribute('background-mute');
    },
  }, {
    name: 'minCache',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('min-cache'), 10);
      return !isNaN(value) ? value : 1;
    },
  }, {
    name: 'maxCache',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('max-cache'), 10);
      return !isNaN(value) ? value : 3;
    },
  }, {
    name: 'soundMode',
    get(domNode) {
      return domNode.getAttribute('sound-mode') || 'speaker';
    },
  }, {
    name: 'autoPauseIfNavigate',
    get(domNode) {
      const value = domNode.getAttribute('auto-pause-if-navigate');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'autoPauseIfOpenNative',
    get(domNode) {
      const value = domNode.getAttribute('auto-pause-if-open-native');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onLivePlayerStateChange(evt) {
      callSimpleEvent('statechange', evt, this.domNode);
    },
    onLivePlayerFullScreenChange(evt) {
      callSimpleEvent('fullscreenchange', evt, this.domNode);
    },
    onLivePlayerNetStatus(evt) {
      callSimpleEvent('netstatus', evt, this.domNode);
    },
  },
};
