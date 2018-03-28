const TIMER_MODULE = '@weex-module/timer';

module.exports = function(__weex_require__, document) {
  const setTimeout = (handler, time) => {
    const timer = __weex_require__(TIMER_MODULE);
    timer.setTimeout(handler, time);
    return document.taskCenter.callbackManager.lastCallbackId.toString();
  };

  const setInterval = (handler, time) => {
    const timer = __weex_require__(TIMER_MODULE);
    timer.setInterval(handler, time);
    return document.taskCenter.callbackManager.lastCallbackId.toString();
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
    return timer.setTimeout(callback, 16);
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
  };
};
