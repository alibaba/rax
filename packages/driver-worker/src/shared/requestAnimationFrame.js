import global from './global';

const requestAnimationFrame = global.requestAnimationFrame || function(cb) {
  return setTimeout(cb, 16);
};

export default requestAnimationFrame;
