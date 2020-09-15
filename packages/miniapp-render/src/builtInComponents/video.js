export default {
  name: 'video',
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
