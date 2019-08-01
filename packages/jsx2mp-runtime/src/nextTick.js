/* global nextTick */
let nextTick = typeof my === 'object' && my.nextTick
  ? my.nextTick
  : setTimeout;

if (typeof process !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // Wrapper timer for hijack timers in jest
  nextTick = (callback) => {
    setTimeout(callback, 0);
  };
}

export default nextTick;
