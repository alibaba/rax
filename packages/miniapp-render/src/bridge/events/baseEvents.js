// Events which should bubble

export default [
  {
    name: 'onTap',
    eventName: 'click',
    extra: {
      button: 0
    }
  },
  {
    name: 'onLongTap',
    name: 'longtap'
  },
  {
    name: 'onTouchStart',
    eventName: 'touchstart'
  },
  {
    name: 'onTouchMove',
    eventName: 'touchmove'
  },
  {
    name: 'onTouchEnd',
    eventName: 'touchend'
  },
  {
    name: 'onTouchCancel',
    eventName: 'touchcancel'
  }
];
