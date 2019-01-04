/**
 * Simulate a tap event from touch/mouse events.
 * Reference from FastClick.
 */

// Touchmove distance, beyond which a click will be cancelled.
const TAP_DISTANCE = 25;
// The minimum time between tap(touchstart and touchend) events
const TAP_DELAY = 200;
const TAP_TIMEOUT = 700;
const TAP_EVENT_NAME = 'tap';

export function setupTap() {
  new SimulateTap(arguments.length > 0 ? arguments[0] : window);
}

class SimulateTap {
  trackingClick = false;
  trackingClickStart = 0;
  targetElement;
  touchStartX;
  touchStartY;
  lastClickTime;
  cancelNextClick;

  constructor(win) {
    this.rootEl = win.document.body;
    this.isTouchDevice = 'ontouchstart' in win || 'onmsgesturechange' in win;

    if (!this.isTouchDevice) {
      this.rootEl.addEventListener('click', this.onClick, true);
    }

    this.rootEl.addEventListener('touchstart', this.onTouchStart, false);
    this.rootEl.addEventListener('touchmove', this.onTouchMove, false);
    this.rootEl.addEventListener('touchend', this.onTouchEnd, false);
    this.rootEl.addEventListener('touchcancel', this.onTouchCancel, false);
  }

  destroy() {
    if (!this.isTouchDevice) {
      this.rootEl.removeEventListener('click', this.onClick, true);
    }

    this.rootEl.removeEventListener('touchstart', this.onTouchStart, false);
    this.rootEl.removeEventListener('touchmove', this.onTouchMove, false);
    this.rootEl.removeEventListener('touchend', this.onTouchEnd, false);
    this.rootEl.removeEventListener('touchcancel', this.onTouchCancel, false);
  }

  /**
   * Proxy the native click event to tap.
   * Not to cancel native click, for support of onClick event.
   *
   * @param {Event} evt
   */
  onClick = (evt) => {
    if (this.cancelNextClick) return;

    this.dispatchTapEvent(evt.target);
  }

  /**
   * On touch start, record the position and scroll offset.
   *
   * @param {Event} evt
   */
  onTouchStart = (evt) => {
    // Ignore multiple touches, otherwise pinch-to-zoom is prevented.
    if (evt.targetTouches.length > 1) {
      return true;
    }

    const touch = evt.targetTouches[0];

    this.trackingClick = true;
    this.trackingClickStart = evt.timeStamp;
    this.targetElement = evt.target;

    this.touchStartX = touch.pageX;
    this.touchStartY = touch.pageY;

    // Prevent phantom clicks on fast double-tap (issue #36)
    if (evt.timeStamp - this.lastClickTime < TAP_DELAY) {
      evt.preventDefault();
    }
  }
  /**
   *
   * Update the last position.
   *
   * @param {Event} evt
   */
  onTouchMove = (evt) => {
    if (!this.trackingClick) {
      return true;
    }

    // If the touch has moved, cancel the click tracking
    if (this.targetElement !== evt.target || this.touchHasMoved(evt)) {
      this.trackingClick = false;
      this.targetElement = null;
    }
  }

  /**
   * On touch end, determine whether to send a tap event.
   *
   * @param {Event} evt
   */
  onTouchEnd = (evt) => {
    if (!this.trackingClick) return true;

    // Prevent from fast tap more than once.
    if (evt.timeStamp - this.lastClickTime < TAP_DELAY) {
      this.cancelNextClick = true;
      return true;
    }

    // Cancel tap if time between start and end is over timeout.
    if (evt.timeStamp - this.trackingClickStart > TAP_TIMEOUT) {
      return true;
    }

    // Reset to prevent wrong click cancel on input.
    this.cancelNextClick = false;
    this.lastClickTime = event.timeStamp;
    this.trackingClick = false;
    this.trackingClickStart = 0;

    this.dispatchTapEvent(evt.target);
  }

  /**
   * Stop simulation of the tap.
   */
  onTouchCancel() {
    this.trackingClick = false;
    this.targetElement = null;
  }

  /**
   * Check whether the touch has moved over a distance since it started.
   *
   * @param {Event} evt
   * @returns {boolean}
   */
  touchHasMoved(evt) {
    const touch = evt.changedTouches[0];

    return Math.abs(touch.pageX - this.touchStartX) > TAP_DISTANCE
      || Math.abs(touch.pageY - this.touchStartY) > TAP_DISTANCE;
  }

  dispatchTapEvent(el) {
    el && el.dispatchEvent(new CustomEvent(TAP_EVENT_NAME, {
      bubbles: true,
      cancelable: true,
    }));
  }
}
