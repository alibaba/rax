const TIMER_MODULE = '@weex-module/timer';

module.exports = function(__weex_require__) {
  const setTimeout = (handler, time) => {
    const timer = __weex_require__(TIMER_MODULE);
    return timer.setTimeout(handler, time);
  };

  const setInterval = (handler, time) => {
    const timer = __weex_require__(TIMER_MODULE);
    return timer.setInterval(handler, time);
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
