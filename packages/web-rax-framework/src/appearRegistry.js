let offsetTop = 0;
let appearEvt, disappearEvt;
let _appearDoms = [];

class AppearRegistry {
  static createEvent() {
    appearEvt = document.createEvent('HTMLEvents');
    disappearEvt = document.createEvent('HTMLEvents');
    appearEvt.initEvent('appear', false, true);
    disappearEvt.initEvent('disappear', false, true);
  }

  constructor(elements) {
    this.current = [];
    this.elements = elements;

    this.options = {
      container: window,
      wait: 100,
      x: 0,
      y: 0,
      cls: 'appear',
      once: false,
      onReset: function() {},
      onAppear: function() {},
      onDisappear: function() {}
    };
    this.container = null;
    this.appearWatchElements = null;

    this.initConfig.apply(this, arguments);
  }

  initConfig(opts) {
    this.extend(this.options, opts || (opts = {}));
    this.appearWatchElements = this.appearWatchElements || this.getElements();
    this.bindEvent();
  }

  extend(target, el) {
    for (let k in el) {
      if (el.hasOwnProperty(k)) {
        target[k] = el[k];
      }
    }
    return target;
  }

  inViewport(element, offset, type) {
    let { top, right, bottom, left } = element.getBoundingClientRect();

    left = offset.right > left && offset.left < right;
    top = offset.bottom > top - offsetTop && offset.top < bottom;
    return left && top;
  }

  getElements(type) {
    let container = this.options.container;
    let appearWatchElements;
    this.container = container;

    appearWatchElements = _appearDoms || [];
    appearWatchElements = [].slice.call(appearWatchElements, null);

    return appearWatchElements;
  }

  // check dom inview
  check(nodes) {
    raf(() => {
      this.calculate(nodes);
    });
  }

  // calculate everyone dom inview
  calculate(nodes) {
    let container = this.container;
    let elements = nodes || this.getElements();
    let containerOffset = getOffset(window, {
      x: this.options.x,
      y: this.options.y
    });
    let isOnce = this.options.once;
    let ev = arguments[0] || {};

    if (!container) {
      return;
    }

    if (elements && elements.length > 0) {
      [].forEach.call(elements, (ele, i) => {
        if (ele) {
          if (ele.isOnce && ele._hasAppear) {
            _appearDoms.splice(i, 1);
            elements.splice(i, 1);
            return;
          }
          this.checkEveryDom(ele, containerOffset, isOnce, appearEvt, disappearEvt, 'normal', i);
        }
      });
    }
  }

  checkEveryDom(ele, containerOffset, isOnce, cacheAppearEvt, cacheDisappearEvt, type, pos) {
    let eleOffset = getOffset(ele);
    let direction = this.getDirection(ele._eleOffset, eleOffset);
    let isInView = this.inViewport(ele, containerOffset, type);
    let appear = ele._appear;
    let _hasAppear = ele._hasAppear;
    let _hasDisAppear = ele._hasDisAppear;
    ele._eleOffset = eleOffset;

    cacheAppearEvt.direction = direction;
    cacheDisappearEvt.direction = direction;
    if (isInView && !appear) {
      if (isOnce && !_hasAppear || !isOnce) {
        ele.dispatchEvent(cacheAppearEvt);
        ele._hasAppear = true;
        ele._appear = true;
      }
    } else if (!isInView && appear) {
      if (isOnce && !_hasDisAppear || !isOnce) {
        ele.dispatchEvent(cacheDisappearEvt);
        ele._hasDisAppear = true;
        ele._appear = false;
      }
    }
  }

  // reset
  reset(opts) {
    this.initConfig(opts);
    this.appearWatchElements.forEach((ele) => {
      delete ele._hasAppear;
      delete ele._hasDisAppear;
      delete ele._appear;
    });
    return this;
  }
  bindEvent() {
    let handle = throttle(() => {
      this.check();
    }, this.options.wait);
    if (this.__handle) {
      this.container.removeEventListener('scroll', this.__handle, false, true);
      this.__handle = null;
    }
    this.__handle = handle;
    this.container.addEventListener('scroll', handle, false, true);
  }

  getDirection(beforeOffset, nowOffset) {
    var direction = 'none';
    var horizental = beforeOffset.left - nowOffset.left;
    var vertical = beforeOffset.top - nowOffset.top;
    if (vertical == 0) {
      if (horizental != 0) {
        direction = horizental > 0 ? 'left' : 'right';
      } else {
        direction = 'none';
      }
    }
    if (horizental == 0) {
      if (vertical != 0) {
        direction = vertical > 0 ? 'up' : 'down';
      } else {
        direction = 'none';
      }
    }
    return direction;
  }
}

let raf = window.requestAnimationFrame || window.webkitRequestAnimationFrame || function(c) {
  setTimeout(c, 1 / 60 * 1e3);
};

function throttle(fn, wait) {
  let context, args, result;
  let timeout = null;
  let previous = 0;

  const later = () => {
    previous = Date.now();
    timeout = null;
    result = fn.apply(context, args);
  };
  return function() {
    const now = Date.now();
    const remaining = wait - (now - previous);
    context = this;
    args = arguments;

    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = fn.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}

export function config(opts) {
  if (opts.offsetTop && typeof opts.offsetTop === 'number') {
    offsetTop = opts.offsetTop;
  }
}

export function getOffset(el, param) {
  let l, r, b, t;
  if (!el) {
    return;
  }
  if (!param) {
    param = {x: 0, y: 0};
  }

  if (el === window) {
    l = 0;
    t = 0;
    r = l + el.innerWidth;
    b = t + el.innerHeight;
  } else if (el.parentNode === null) {
    l = 0;
    t = 0;
    r = 0;
    b = 0;
  } else {
    const { top, right, bottom, left } = el.getBoundingClientRect();
    l = left;
    t = top;
    r = right;
    b = bottom;
  }

  return {
    'left': l,
    'top': t,
    'right': r + param.x,
    'bottom': b + param.y
  };
}

// add element
export function pushElement(node) {
  if (_appearDoms.indexOf(node) === -1 && !node.appended) {
    let isOnce = Boolean(node.getAttribute('isonce')) || Boolean(node.getAttribute('data-once'));
    node.isOnce = isOnce;
    node.appended = true;
    _appearDoms.push(node);
    node._eleOffset = getOffset(node);
  }
}

export default AppearRegistry;
