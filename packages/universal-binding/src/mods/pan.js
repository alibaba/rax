'use strict';
import _ from 'simple-lodash';
import assign from 'object-assign';
import {pxTo750} from './utils';


const {abs} = Math;

const DEFAULT_CONFIG = {
  thresholdX: 10,
  thresholdY: 10,
  touchAction: 'auto',
  touchActionRatio: 1 / 2 // 默认1:2
};

export default class PanGesture {

  startX = null;

  startY = null;

  panStartX = null;

  panStartY = null;

  deltaX = 0;

  deltaY = 0;

  events = {
    'panstart': [],
    'pan': [],
    'panend': [],
    'pancancel': []
  };

  constructor(el, config) {
    this.el = el;
    this.config = assign(DEFAULT_CONFIG, config);
    this.el.addEventListener('touchstart', this.onTouchStart);
    this.el.addEventListener('touchmove', this.onTouchMove);
    this.el.addEventListener('touchend', this.onTouchEnd);
    this.el.addEventListener('touchcancel', this.onTouchCancel);
  }

  onTouchStart = (e) => {
    // e.preventDefault();
  }

  handlePanStart = (e) => {
    e.preventDefault();
    if (this.panStartX === null || this.panStartY === null) {
      this.panStartX = pxTo750(e.touches[0].pageX);
      this.panStartY = pxTo750(e.touches[0].pageY);
      this.events.panstart.forEach((handler) => {
        handler(e);
      });
      return;
    }
  }

  onTouchMove = (e) => {
    let {thresholdX, thresholdY, touchAction, touchActionRatio} = this.config;
    if (this.startX === null || this.startY === null) {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    }
    let dx = e.touches[0].pageX - this.startX;
    let dy = e.touches[0].pageY - this.startY;

    switch (touchAction) {
      case 'auto':
        e.preventDefault();
        if (abs(dx) >= thresholdX || abs(dy) >= thresholdY) {
          this.handlePanStart(e);
        }
        break;
      case 'pan-x':
        if (abs(dx) >= thresholdX && abs(dy / dx) < touchActionRatio && abs(dy) < thresholdY) {
          this.handlePanStart(e);
        }
        break;
      case 'pan-y':
        if (abs(dy) >= thresholdY && abs(dx / dy) < touchActionRatio && abs(dx) < thresholdX) {
          this.handlePanStart(e);
        }
        break;
    }


    if (this.panStartX !== null && this.panStartY !== null) {
      switch (touchAction) {
        case 'auto':
          this.deltaX = pxTo750(e.touches[0].pageX) - this.panStartX;
          this.deltaY = pxTo750(e.touches[0].pageY) - this.panStartY;
          break;
        case 'pan-x':
          this.deltaX = pxTo750(e.touches[0].pageX) - this.panStartX;
          this.deltaY = 0;
          break;
        case 'pan-y':
          this.deltaX = 0;
          this.deltaY = pxTo750(e.touches[0].pageY) - this.panStartY;
          break;
      }
      e.deltaX = this.deltaX;
      e.deltaY = this.deltaY;
      this.events.pan.forEach((handler) => {
        handler(e);
      });
    }
  }

  onTouchEnd = (e) => {
    e.deltaX = this.deltaX;
    e.deltaY = this.deltaY;
    this.events.panend.forEach((handler) => {
      handler(e);
    });
  }

  onTouchCancel = (e) => {
    e.deltaX = this.deltaX;
    e.deltaY = this.deltaY;
    this.events.pancancel.forEach((handler) => {
      handler(e);
    });
  }


  on(fn, handler) {
    if (!this.events[fn]) return;
    this.events[fn].push(handler);
  }

  destroy() {
    this.el.removeEventListener('touchstart', this.onTouchStart);
    this.el.removeEventListener('touchmove', this.onTouchMove);
    this.el.removeEventListener('touchend', this.onTouchEnd);
    this.el.removeEventListener('touchcancel', this.onTouchCancel);
    this.offAll();
    this.startX = null;
    this.startY = null;
    this.panStartX = null;
    this.panStartY = null;
  }

  offAll() {
    _.map(this.events, (handlers, fn) => {
      _.forEach(handlers, (handler) => {
        this.off(fn, handler);
      });
    });
  }

  off(fn, handler) {
    if (!fn) return;
    if (fn && this.events[fn] && this.events[fn].length) {
      if (!handler) return;
      let h = _.find(this.events[fn], (o) => {
        return o === handler;
      });
      let i = _.findIndex(this.events[fn], (o) => {
        return o === handler;
      });
      if (h) {
        this.events[fn].splice(i, 1);
      }
    }
  }


}