const ua = typeof navigator !== 'undefined' ? navigator.userAgent.toLowerCase() : '';

export default {
  os: {
    iphone: ua.match(/(iphone\sos)\s([\d_]+)/)
  },
};
