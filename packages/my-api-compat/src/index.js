import * as my from './api';

const GLOBAL = getGlobalObject();

if (GLOBAL && typeof GLOBAL.my === 'object') {
  exports.default = GLOBAL.my;
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
