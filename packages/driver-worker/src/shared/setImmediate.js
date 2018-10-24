import global from './global';

const setImmediate = global.setImmediate || function(cb) {
  return setTimeout(cb, 0);
};

export default setImmediate;
