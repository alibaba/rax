// eslint-disable-next-line import/no-extraneous-dependencies
import { isMiniApp } from 'universal-env';

let props = [{
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
  name: 'danmu-list',
  get(domNode) {
    const value = domNode.getAttribute('danmu-list');
    return value !== undefined ? value : [];
  },
}, {
  name: 'danmu-btn',
  get(domNode) {
    return !!domNode.getAttribute('danmu-btn');
  },
}, {
  name: 'enable-danmu',
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
  name: 'initial-time',
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
  name: 'show-progress',
  get(domNode) {
    const value = domNode.getAttribute('show-progress');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'show-fullscreen-btn',
  get(domNode) {
    const value = domNode.getAttribute('show-fullscreen-btn');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'show-play-btn',
  get(domNode) {
    const value = domNode.getAttribute('show-play-btn');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'show-center-play-btn',
  get(domNode) {
    const value = domNode.getAttribute('show-center-play-btn');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'enable-progress-gesture',
  get(domNode) {
    const value = domNode.getAttribute('enable-progress-gesture');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'object-fit',
  get(domNode) {
    return domNode.getAttribute('object-fit') || 'contain';
  },
}, {
  name: 'poster',
  get(domNode) {
    return domNode.poster;
  },
}, {
  name: 'show-mute-btn',
  get(domNode) {
    return !!domNode.getAttribute('show-mute-btn');
  },
}, {
  name: 'title',
  get(domNode) {
    return domNode.getAttribute('title') || '';
  },
}, {
  name: 'play-btn-position',
  get(domNode) {
    return domNode.getAttribute('play-btn-position') || 'bottom';
  },
}, {
  name: 'enable-play-gesture',
  get(domNode) {
    return !!domNode.getAttribute('enable-play-gesture');
  },
}, {
  name: 'auto-pause-if-navigate',
  get(domNode) {
    const value = domNode.getAttribute('auto-pause-if-navigate');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'auto-pause-if-open-native',
  get(domNode) {
    const value = domNode.getAttribute('auto-pause-if-open-native');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'vslide-gesture',
  get(domNode) {
    return !!domNode.getAttribute('vslide-gesture');
  },
}, {
  name: 'vslide-gesture-in-fullscreen',
  get(domNode) {
    const value = domNode.getAttribute('vslide-gesture-in-fullscreen');
    return value !== undefined ? !!value : true;
  },
}, {
  name: 'animation',
  get(domNode) {
    return domNode.getAttribute('animation');
  }
}];

if (isMiniApp) {
  props = props.concat([{
    name: 'enableNative',
    get(domNode) {
      return !!domNode.getAttribute('enableNative');
    }
  }, {
    name: 'playsinline',
    get(domNode) {
      return !!domNode.getAttribute('playsinline');
    }
  }, {
    name: 'rawControls',
    get(domNode) {
      return !!domNode.getAttribute('rawControls');
    }
  }]);
}
export default {
  name: 'video',
  props,
  singleEvents: [{
    name: 'onVideoPlay',
    eventName: 'play'
  },
  {
    name: 'onVideoPause',
    eventName: 'pause'
  },
  {
    name: 'onVideoEnded',
    eventName: 'ended'
  },
  {
    name: 'onVideoFullScreenChange',
    eventName: 'fullscreenchange'
  },
  {
    name: 'onVideoWaiting',
    eventName: 'waiting'
  },
  {
    name: 'onVideoError',
    eventName: 'error'
  }],
  functionalSingleEvents: [
    {
      name: 'onVideoTimeUpdate',
      eventName: 'timeupdate',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('currentTime', evt.detail.currentTime);
      }
    },
    {
      name: 'onVideoProgress',
      eventName: 'progress',
      middleware(evt, domNode) {
        domNode._setAttributeWithOutUpdate('buffered', evt.detail.buffered);
      }
    }
  ]
};
