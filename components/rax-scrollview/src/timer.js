const requestAnimationFrame = typeof requestAnimationFrame === 'undefined' ?
  typeof webkitRequestAnimationFrame === 'undefined' ?
    job => setTimeout(job, 16) :
    webkitRequestAnimationFrame : requestAnimationFrame;

const cancelAnimationFrame = typeof cancelAnimationFrame === 'undefined' ?
  typeof webkitCancelAnimationFrame === 'undefined' ?
    clearTimeout :
    webkitCancelAnimationFrame : cancelAnimationFrame;

const TYPES = {
  START: 'start',
  END: 'end',
  RUN: 'run',
  STOP: 'stop'
};

const easing = {
  easeOutSine(x) {
    return Math.sin(x * Math.PI / 2);
  }
};

const MIN_DURATION = 1;

const noop = () => {};

class Timer {
  constructor(config) {
    this.config = {
      easing: 'linear',
      duration: Infinity,
      onStart: noop,
      onRun: noop,
      onStop: noop,
      onEnd: noop,
      ...config,
    };
  }

  run() {
    let {duration, onStart, onRun} = this.config;
    if (duration <= MIN_DURATION) {
      this.isfinished = true;
      onRun({percent: 1});
      this.stop();
    }
    if (this.isfinished) return;
    this._hasFinishedPercent = this._stop && this._stop.percent || 0;
    this._stop = null;
    this.start = Date.now();
    this.percent = 0;
    onStart({percent: 0, type: TYPES.START});
    // epsilon determines the precision of the solved values
    let epsilon = 1000 / 60 / duration / 4;
    this.easingFn = easing[this.config.easing];
    this._run();
  }

  _run() {
    let {onRun, onStop} = this.config;
    this._raf && cancelAnimationFrame(this._raf);
    this._raf = requestAnimationFrame(() => {
      this.now = Date.now();
      this.t = this.now - this.start;
      this.duration = this.now - this.start >= this.config.duration ? this.config.duration : this.now - this.start;
      this.progress = this.easingFn(this.duration / this.config.duration);
      this.percent = this.duration / this.config.duration + this._hasFinishedPercent;
      if (this.percent >= 1 || this._stop) {
        this.percent = this._stop && this._stop.percent ? this._stop.percent : 1;
        this.duration = this._stop && this._stop.duration ? this._stop.duration : this.duration;

        onRun({
          percent: this.progress,
          originPercent: this.percent,
          t: this.t,
          type: TYPES.RUN
        });

        onStop({
          percent: this.percent,
          t: this.t,
          type: TYPES.STOP
        });

        if (this.percent >= 1) {
          this.isfinished = true;
          this.stop();
        }
        return;
      }

      onRun({
        percent: this.progress,
        originPercent: this.percent,
        t: this.t,
        type: TYPES.RUN
      });

      this._run();
    });
  }

  stop() {
    let {onEnd} = this.config;
    this._stop = {
      percent: this.percent,
      now: this.now
    };
    onEnd({
      percent: 1,
      t: this.t,
      type: TYPES.END
    });
    cancelAnimationFrame(this._raf);
  }
}

export default Timer;
