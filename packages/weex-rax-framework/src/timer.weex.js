const TIMER_MODULE = '@weex-module/timer';

module.exports = function(__weex_require__, instance) {

  const setTimeout = (...args) => {
    const timer = __weex_require__(TIMER_MODULE);
    const handler = function() {
      args[0](...args.slice(2));
    };
    timer.setTimeout(handler, args[1]);
    return instance.uid.toString();
  };

  const setInterval = (...args) => {
    const timer = __weex_require__(TIMER_MODULE);
    const handler = function() {
      args[0](...args.slice(2));
    };
    timer.setInterval(handler, args[1]);
    return instance.uid.toString();
  };

  const clearTimeout = (n) => {
    const timer = __weex_require__(TIMER_MODULE);
    timer.clearTimeout(n);
  };

  const clearInterval = (n) => {
    const timer = __weex_require__(TIMER_MODULE);
    timer.clearInterval(n);
  };

  const requestAnimationFrame = (callback) => {
    const timer = __weex_require__(TIMER_MODULE);
    timer.setTimeout(callback, 16);
    return instance.uid.toString();
  };

  const cancelAnimationFrame = (n) => {
    const timer = __weex_require__(TIMER_MODULE);
    timer.clearTimeout(n);
  };

  return {
    setTimeout,
    clearTimeout,
    setInterval,
    clearInterval,
    requestAnimationFrame,
    cancelAnimationFrame
  }
};
