'use strict';

import {isWeex} from 'universal-env';
import _ from 'simple-lodash';

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
    ? (value < min ? min : value > max ? max : value)
    : (value < max ? max : value > min ? min : value);
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
    _.map(data, (v, k) => {
      event[k] = v;
    });
    window.dispatchEvent(event);
  }
};

export {
  clamp,
  resolveURL,
  noop,
  forbidSwipeBack,
  uuid,
  Event
};