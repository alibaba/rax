const synchronousScheduler = job => job();

const requestAnimationFramePolyfill = job => setTimeout(job, 16);
const animationScheduler = typeof requestAnimationFrame === 'undefined' ?
  typeof webkitRequestAnimationFrame === 'undefined' ?
    requestAnimationFramePolyfill :
    webkitRequestAnimationFrame : requestAnimationFrame;

const requestIdleCallbackPolyfill = job => setTimeout(job, 1024); // 1s
const backgroundScheduler = typeof requestIdleCallback === 'undefined' ?
  requestIdleCallbackPolyfill : requestIdleCallback;

let currentScheduler = synchronousScheduler;

export default {
  getScheduler: () => currentScheduler,
  setScheduler: scheduler => currentScheduler = scheduler,
  synchronousScheduler,
  animationScheduler,
  backgroundScheduler,
};
