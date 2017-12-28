'use strict';

import EventEmitter from 'events';
import easing from './easing';
import bezier from './bezier';
import {raf, cancelRAF} from './raf';
import assign from 'object-assign';

export default class Animation extends EventEmitter {

  static MIN_DURATION = 1;

  cfg = null;

  constructor(cfg) {
    super(cfg);
    this.cfg = assign({
      easing: 'linear',
      duration: Infinity
    }, cfg);
  }

  run() {
    let duration = this.cfg.duration;
    if (duration <= Animation.MIN_DURATION) {
      this.isfinished = true;
      this.emit('run', {
        percent: 1
      });
      this.emit('end', {
        percent: 1
      });
    }
    if (this.isfinished) return;
    this._hasFinishedPercent = this._stop && this._stop.percent || 0;
    this._stop = null;
    this.start = Date.now();
    this.percent = 0;
    this.emit('start', {
      percent: 0
    });
    // epsilon determines the precision of the solved values
    let epsilon = 1000 / 60 / duration / 4;
    let b = this.cfg.bezierArgs;
    this.easingFn = b && b.length === 4 ? bezier(b[0], b[1], b[2], b[3], epsilon) : easing[this.cfg.easing];
    this._run();
  }

  _run() {
    cancelRAF(this._raf);
    this._raf = raf(() => {
      this.now = Date.now();
      this.t = this.now - this.start;
      this.duration = this.now - this.start >= this.cfg.duration ? this.cfg.duration : this.now - this.start;
      this.progress = this.easingFn(this.duration / this.cfg.duration);
      this.percent = this.duration / this.cfg.duration + this._hasFinishedPercent;
      if (this.percent >= 1 || this._stop) {
        this.percent = this._stop && this._stop.percent ? this._stop.percent : 1;
        this.duration = this._stop && this._stop.duration ? this._stop.duration : this.duration;
        let param = {
          percent: this.percent,
          t: this.t
        };
        this.emit('run', {
          percent: this.progress,
          originPercent: this.percent,
          t: this.t
        });
        this.emit('stop', param);
        if (this.percent >= 1) {
          this.isfinished = true;
          this.emit('end', {
            percent: 1,
            t: this.t
          });
        }
        return;
      }
      this.emit('run', {
        percent: this.progress,
        originPercent: this.percent,
        t: this.t
      });
      this._run();
    });
  }

  stop() {
    this._stop = {
      percent: this.percent,
      now: this.now
    };
    cancelRAF(this._raf);
  }


};


