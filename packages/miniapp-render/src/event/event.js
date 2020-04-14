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
    this.$_name = options.name.toLowerCase();
    this.$_target = options.target;
    this.$_timeStamp = options.timeStamp || Date.now();
    this.$_currentTarget = options.currentTarget || options.target;
    this.$_eventPhase = options.eventPhase || Event.NONE;
    this.$_detail = options.detail || null;
    this.$_immediateStop = false;
    this.$_canBubble = true;
    this.$_bubbles = options.bubbles || false;
    this.$_touches = null;
    this.$_targetTouches = null;
    this.$_changedTouches = null;
    this.$_cancelable = false;

    // Add fields
    const extra = options.$$extra;
    if (extra) {
      Object.keys(extra).forEach(key => {
        this[key] = extra[key];
      });
    }

    // Handle touches
    if (options.touches && options.touches.length) {
      this.$_touches = options.touches.map(touch => ({...touch, target: options.target}));

      this.$$checkTargetTouches();
    }

    // Handle changedTouches
    if (options.changedTouches && options.changedTouches.length) {
      this.$_changedTouches = options.changedTouches.map(touch => ({...touch, target: options.target}));
    }
  }

  // Whether the event is stopped immediately
  get $$immediateStop() {
    return this.$_immediateStop;
  }

  // Whether can bubble
  get $$canBubble() {
    return this.$_canBubble;
  }

  // Set target
  $$setTarget(target) {
    this.$_target = target;
  }

  // Set currentTarget
  $$setCurrentTarget(currentTarget) {
    this.$_currentTarget = currentTarget;
    this.$$checkTargetTouches();
  }

  // Set the stage of the event
  $$setEventPhase(eventPhase) {
    this.$_eventPhase = eventPhase;
  }

  // Check targetTouches
  $$checkTargetTouches() {
    if (this.$_touches && this.$_touches.length) {
      this.$_targetTouches = this.$_touches.filter(touch => checkRelation(touch.target, this.$_currentTarget));
    }
  }

  get bubbles() {
    return this.$_bubbles;
  }

  get cancelable() {
    return this.$_cancelable;
  }

  get target() {
    return this.$_target;
  }

  get currentTarget() {
    return this.$_currentTarget;
  }

  get eventPhase() {
    return this.$_eventPhase;
  }

  get type() {
    return this.$_name;
  }

  get timeStamp() {
    return this.$_timeStamp;
  }

  get touches() {
    return this.$_touches;
  }

  get targetTouches() {
    return this.$_targetTouches;
  }

  get changedTouches() {
    return this.$_changedTouches;
  }

  set detail(value) {
    this.$_detail = value;
  }

  get detail() {
    return this.$_detail;
  }

  preventDefault() {
    this.$_cancelable = true;
  }

  stopPropagation() {
    if (this.eventPhase === Event.NONE) return;

    this.$_canBubble = false;
  }

  stopImmediatePropagation() {
    if (this.eventPhase === Event.NONE) return;

    this.$_immediateStop = true;
    this.$_canBubble = false;
  }

  initEvent(name = '', bubbles) {
    if (typeof name !== 'string') return;

    this.$_name = name.toLowerCase();
    this.$_bubbles = bubbles === undefined ? this.$_bubbles : !!bubbles;
  }
}

// Static props
Event.NONE = 0;
Event.CAPTURING_PHASE = 1;
Event.AT_TARGET = 2;
Event.BUBBLING_PHASE = 3;

export default Event;
