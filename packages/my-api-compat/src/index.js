import * as my from './api';

const global = getGlobalObject();

if (global && typeof global.my === 'object') {
  exports.default = global.my;
} else {
  my.canIUse = api => api in my;
  exports.default = my;
}

function getGlobalObject() {
  return typeof global !== 'undefined'
    ? global
    : typeof self !== 'undefined'
      ? self
      : (new Function('return this'))(); // eslint-disable-line
}

exports.__esModule = true;
