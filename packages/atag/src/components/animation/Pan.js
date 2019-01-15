export default class Pan {
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

  constructor(element) {
    this.config = {
      thresholdX: 10,
      thresholdY: 10,
      touchAction: 'auto',
      touchActionRatio: 1 / 2
    };
    this.element = element;
    this.element.addEventListener('touchstart', this.onTouchStart);
    this.element.addEventListener('touchmove', this.onTouchMove);
    this.element.addEventListener('touchend', this.onTouchEnd);
    this.element.addEventListener('touchcancel', this.onTouchCancel);
  }

  handlePanStart = (e) => {
    if (this.panStartX === null || this.panStartY === null) {
      this.panStartX = e.touches[0].pageX;
      this.panStartY = e.touches[0].pageY;
      this.events.panstart.forEach((handler) => {
        handler(e);
      });
      return;
    }
  }

  onTouchStart = (e) => {
    this.startX = e.touches[0].pageX;
    this.startY = e.touches[0].pageY;
    this.handlePanStart(e);
  };

  onTouchMove = (e) => {
    let { thresholdX, thresholdY, touchAction, touchActionRatio } = this.config;
    if (this.startX === null || this.startY === null) {
      this.startX = e.touches[0].pageX;
      this.startY = e.touches[0].pageY;
    }
    let dx = e.touches[0].pageX - this.startX;
    let dy = e.touches[0].pageY - this.startY;

    switch (touchAction) {
      case 'auto':
        if (Math.abs(dx) >= thresholdX || Math.abs(dy) >= thresholdY) {
          this.handlePanStart(e);
        }
        break;
      case 'pan-x':
        if (Math.abs(dx) >= thresholdX && Math.abs(dy / dx) < touchActionRatio && Math.abs(dy) < thresholdY) {
          this.handlePanStart(e);
        }
        break;
      case 'pan-y':
        if (Math.abs(dy) >= thresholdY && Math.abs(dx / dy) < touchActionRatio && Math.abs(dx) < thresholdX) {
          this.handlePanStart(e);
        }
        break;
    }

    if (this.panStartX !== null && this.panStartY !== null) {
      this.deltaX = e.touches[0].pageX - this.panStartX;
      this.deltaY = e.touches[0].pageY - this.panStartY;
      switch (touchAction) {
        case 'auto':
          this.deltaX = e.touches[0].pageX - this.panStartX;
          this.deltaY = e.touches[0].pageY - this.panStartY;
          break;
        case 'pan-x':
          this.deltaX = e.touches[0].pageX - this.panStartX;
          this.deltaY = 0;
          break;
        case 'pan-y':
          this.deltaX = 0;
          this.deltaY = e.touches[0].pageY - this.panStartY;
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
    this.panStartX = null;
    this.panStartY = null;
    this.events.panend.forEach((handler) => {
      handler(e);
    });
  }

  onTouchCancel = (e) => {
    e.deltaX = this.deltaX;
    e.deltaY = this.deltaY;
    this.panStartX = null;
    this.panStartY = null;
    this.events.pancancel.forEach((handler) => {
      handler(e);
    });
  }

  on(fn, handler) {
    if (!this.events[fn]) return;
    this.events[fn].push(handler);
  }

  destroy() {
    this.element.removeEventListener('touchstart', this.onTouchStart);
    this.element.removeEventListener('touchmove', this.onTouchMove);
    this.element.removeEventListener('touchend', this.onTouchEnd);
    this.element.removeEventListener('touchcancel', this.onTouchCancel);
    this.offAll();
    this.startX = null;
    this.startY = null;
    this.panStartX = null;
    this.panStartY = null;
  }

  offAll() {
    this.events.map((handlers, fn) => {
      handlers.forEach((handler) => {
        this.off(fn, handler);
      });
    });
  }

  off(fn, handler) {
    if (!fn) return;
    if (fn && this.events[fn] && this.events[fn].length) {
      if (!handler) return;
      let h = this.events[fn].find((o) => {
        return o === handler;
      });
      let i = this.events[fn].findIndex((o) => {
        return o === handler;
      });
      if (h) {
        this.events[fn].splice(i, 1);
      }
    }
  }
}