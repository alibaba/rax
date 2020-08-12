/**
 * Check the relationships between nodes
 */
function checkRelation(node1, node2) {
  if (node1 === node2) return true;

  while (node1) {
    if (node1 === node2) return true;

    node1 = node1.parentNode;
  }

  return false;
}

class Event {
  constructor(options) {
    this.__name = options.name.toLowerCase();
    this.__target = options.target;
    this.__timeStamp = options.timeStamp || Date.now();
    this.__currentTarget = options.currentTarget || options.target;
    this.__eventPhase = options.eventPhase || Event.NONE;
    this.__detail = options.detail || null;
    this.__immediateStop = false;
    this.__canBubble = true;
    this.__bubbles = options.bubbles || false;
    this.__touches = null;
    this.__targetTouches = null;
    this.__changedTouches = null;
    this.__cancelable = false;

    // Add fields
    const extra = options.__extra;
    if (extra) {
      Object.keys(extra).forEach(key => {
        this[key] = extra[key];
      });
    }

    // Handle touches
    if (options.touches && options.touches.length) {
      this.__touches = options.touches.map(touch => ({...touch, target: options.target}));

      this._checkTargetTouches();
    }

    // Handle changedTouches
    if (options.changedTouches && options.changedTouches.length) {
      this.__changedTouches = options.changedTouches.map(touch => ({...touch, target: options.target}));
    }
  }

  // Whether the event is stopped immediately
  get _immediateStop() {
    return this.__immediateStop;
  }

  // Whether can bubble
  get _canBubble() {
    return this.__canBubble;
  }

  // Set target
  _setTarget(target) {
    this.__target = target;
  }

  // Set currentTarget
  _setCurrentTarget(currentTarget) {
    this.__currentTarget = currentTarget;
    this._checkTargetTouches();
  }

  // Set the stage of the event
  _setEventPhase(eventPhase) {
    this.__eventPhase = eventPhase;
  }

  // Check targetTouches
  _checkTargetTouches() {
    if (this.__touches && this.__touches.length) {
      this.__targetTouches = this.__touches.filter(touch => checkRelation(touch.target, this.__currentTarget));
    }
  }

  get bubbles() {
    return this.__bubbles;
  }

  get cancelable() {
    return this.__cancelable;
  }

  get target() {
    return this.__target;
  }

  get currentTarget() {
    return this.__currentTarget;
  }

  get eventPhase() {
    return this.__eventPhase;
  }

  get type() {
    return this.__name;
  }

  get timeStamp() {
    return this.__timeStamp;
  }

  get touches() {
    return this.__touches;
  }

  get targetTouches() {
    return this.__targetTouches;
  }

  get changedTouches() {
    return this.__changedTouches;
  }

  set detail(value) {
    this.__detail = value;
  }

  get detail() {
    return this.__detail;
  }

  preventDefault() {
    this.__cancelable = true;
  }

  stopPropagation() {
    if (this.eventPhase === Event.NONE) return;

    this.__canBubble = false;
  }

  stopImmediatePropagation() {
    if (this.eventPhase === Event.NONE) return;

    this.__immediateStop = true;
    this.__canBubble = false;
  }

  initEvent(name = '', bubbles) {
    if (typeof name !== 'string') return;

    this.__name = name.toLowerCase();
    this.__bubbles = bubbles === undefined ? this.__bubbles : !!bubbles;
  }
}

// Static props
Event.NONE = 0;
Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

export default Event;
