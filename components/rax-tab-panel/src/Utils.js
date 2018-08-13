'use strict';

import {isWeex} from 'universal-env';

const h = new window.URL(location.href);
const protocol = h.protocol === 'http:' ? 'http:' : 'https:';

let __i = 0;

function uuid() {
  let id = __i++;
  return id;
}

function resolveURL(url) {
  if (!url) return url;
  const matches = url.match(/^(\/\/)?/);
  if (matches && matches[0] === '//') {
    url = protocol + url;
  }
  return url;
}


function noop() {
};


function clamp(value, min, max) {
  return min < max
    ? value < min ? min : value > max ? max : value
    : value < max ? max : value > min ? min : value;
};

// forbid swipe back on IOS
function forbidSwipeBack(isForbid) {
  if (isWeex) {
    let swipeBack = {};
    try {
      swipeBack = require('@weex-module/swipeBack');
    } catch (e) {
    }
    swipeBack.forbidSwipeBack && swipeBack.forbidSwipeBack(isForbid);
  }
}

let Event = {
  on: (eventName, handler) => {
    window.addEventListener(eventName, handler);
  },
  emit: (eventName, data) => {
    var event = new window.Event(eventName);
    if (data) {
      Object.keys(data).forEach((k) => {
        event[k] = data[k];
      });
    }
    window.dispatchEvent(event);
  }
};

function findIndex(o, condition) {
  return o.indexOf(find(o, condition));
}

function forEach(o, fn) {
  if (o instanceof Array) {
    return Array.prototype.forEach.call(o, fn);
  }
  Object.keys(o).forEach((key) => {
    fn(o[key], key);
  });
}

function find(o, condition) {
  var result = null;
  forEach(o, (v, k) => {
    if (typeof condition === 'function') {
      if (condition(v, k)) {
        result = v;
      }
    } else {
      var propName = Object.keys(condition)[0];
      if (propName && v[propName] === condition[propName]) {
        result = v;
      }
    }
  });
  return result;
}

export {
  clamp,
  resolveURL,
  noop,
  forbidSwipeBack,
  uuid,
  Event,
  findIndex
};