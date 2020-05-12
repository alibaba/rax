import callSingleEvent from '../events/callSingleEvent';

export default {
  name: 'video',
  props: [{
    name: 'src',
    get(domNode) {
      return domNode.src;
    },
  }, {
    name: 'duration',
    get(domNode) {
      return +domNode.getAttribute('duration') || 0;
    },
  }, {
    name: 'controls',
    get(domNode) {
      return domNode.controls;
    },
  }, {
    name: 'danmuList',
    get(domNode) {
      const value = domNode.getAttribute('danmu-list');
      return value !== undefined ? value : [];
    },
  }, {
    name: 'danmuBtn',
    get(domNode) {
      return !!domNode.getAttribute('danmu-btn');
    },
  }, {
    name: 'enableDanmu',
    get(domNode) {
      return !!domNode.getAttribute('enable-danmu');
    },
  }, {
    name: 'autoplay',
    get(domNode) {
      return domNode.autoplay;
    },
  }, {
    name: 'loop',
    get(domNode) {
      return domNode.loop;
    },
  }, {
    name: 'muted',
    get(domNode) {
      return domNode.muted;
    },
  }, {
    name: 'initialTime',
    get(domNode) {
      return +domNode.getAttribute('initial-time') || 0;
    },
  }, {
    name: 'direction',
    get(domNode) {
      const value = parseInt(domNode.getAttribute('direction'), 10);
      return !isNaN(value) ? value : -1;
    },
  }, {
    name: 'showProgress',
    get(domNode) {
      const value = domNode.getAttribute('show-progress');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'showFullscreenBtn',
    get(domNode) {
      const value = domNode.getAttribute('show-fullscreen-btn');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'showPlayBtn',
    get(domNode) {
      const value = domNode.getAttribute('show-play-btn');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'showCenterPlayBtn',
    get(domNode) {
      const value = domNode.getAttribute('show-center-play-btn');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'enableProgressGesture',
    get(domNode) {
      const value = domNode.getAttribute('enable-progress-gesture');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'objectFit',
    get(domNode) {
      return domNode.getAttribute('object-fit') || 'contain';
    },
  }, {
    name: 'poster',
    get(domNode) {
      return domNode.poster;
    },
  }, {
    name: 'showMuteBtn',
    get(domNode) {
      return !!domNode.getAttribute('show-mute-btn');
    },
  }, {
    name: 'title',
    get(domNode) {
      return domNode.getAttribute('title') || '';
    },
  }, {
    name: 'playBtnPosition',
    get(domNode) {
      return domNode.getAttribute('play-btn-position') || 'bottom';
    },
  }, {
    name: 'enablePlayGesture',
    get(domNode) {
      return !!domNode.getAttribute('enable-play-gesture');
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
    name: 'vslideGesture',
    get(domNode) {
      return !!domNode.getAttribute('vslide-gesture');
    },
  }, {
    name: 'vslideGestureInFullscreen',
    get(domNode) {
      const value = domNode.getAttribute('vslide-gesture-in-fullscreen');
      return value !== undefined ? !!value : true;
    },
  }, {
    name: 'animation',
    get(domNode) {
      return domNode.getAttribute('animation');
    }
  }],
  handles: {
    onVideoPlay(evt) {
      callSingleEvent('play', evt, this);
    },
    onVideoPause(evt) {
      callSingleEvent('pause', evt, this);
    },
    onVideoEnded(evt) {
      callSingleEvent('ended', evt, this);
    },
    onVideoTimeUpdate(evt) {
      const domNode = this.getDomNodeFromEvt('timeupdate', evt);
      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('currentTime', evt.detail.currentTime);
      callSingleEvent('timeupdate', evt, this);
    },
    onVideoFullScreenChange(evt) {
      callSingleEvent('fullscreenchange', evt, this);
    },
    onVideoWaiting(evt) {
      callSingleEvent('waiting', evt, this);
    },
    onVideoError(evt) {
      callSingleEvent('error', evt, this);
    },
    onVideoProgress(evt) {
      const domNode = this.getDomNodeFromEvt('progress', evt);
      if (!domNode) return;

      domNode.$$setAttributeWithoutUpdate('buffered', evt.detail.buffered);
      callSingleEvent('progress', evt, this);
    },
  },
};
