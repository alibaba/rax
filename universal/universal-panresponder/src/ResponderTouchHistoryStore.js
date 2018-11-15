/**
 * Touch position/time tracking information by touchID. Typically, we'll only
 * see IDs with a range of 1-20 (they are recycled when touches end and then
 * start again). This data is commonly needed by many different interaction
 * logic modules so precomputing it is very helpful to do once.
 * Each touch object in `touchBank` is of the following form:
 * { touchActive: boolean,
 *   startTimeStamp: number,
 *   startPageX: number,
 *   startPageY: number,
 *   currentPageX: number,
 *   currentPageY: number,
 *   currentTimeStamp: number
 * }
 */
var touchHistory = {
  touchBank: {},
  numberActiveTouches: 0,
  // If there is only one active touch, we remember its location. This prevents
  // us having to loop through all of the touches all the time in the most
  // common case.
  indexOfSingleActiveTouch: -1,
  mostRecentTimeStamp: 0,
};

/**
 * TODO: Instead of making gestures recompute filtered velocity, we could
 * include a built in velocity computation that can be reused globally.
 * @param {Touch} touch Native touch object.
 */
var initializeTouchData = function(touch) {
  return {
    touchActive: true,
    startTimeStamp: touch.timestamp,
    startPageX: touch.pageX,
    startPageY: touch.pageY,
    currentPageX: touch.pageX,
    currentPageY: touch.pageY,
    currentTimeStamp: touch.timestamp,
    previousPageX: touch.pageX,
    previousPageY: touch.pageY,
    previousTimeStamp: touch.timestamp,
  };
};

var reinitializeTouchTrack = function(touchTrack, touch) {
  touchTrack.touchActive = true;
  touchTrack.startTimeStamp = touch.timestamp;
  touchTrack.startPageX = touch.pageX;
  touchTrack.startPageY = touch.pageY;
  touchTrack.currentPageX = touch.pageX;
  touchTrack.currentPageY = touch.pageY;
  touchTrack.currentTimeStamp = touch.timestamp;
  touchTrack.previousPageX = touch.pageX;
  touchTrack.previousPageY = touch.pageY;
  touchTrack.previousTimeStamp = touch.timestamp;
};

var recordStartTouchData = function(touch) {
  var touchBank = touchHistory.touchBank;
  var identifier = touch.identifier;
  var touchTrack = touchBank[identifier];
  if (touchTrack) {
    reinitializeTouchTrack(touchTrack, touch);
  } else {
    touchBank[touch.identifier] = initializeTouchData(touch);
  }
  touchHistory.mostRecentTimeStamp = touch.timestamp;
};

var recordMoveTouchData = function(touch) {
  var touchBank = touchHistory.touchBank;
  var touchTrack = touchBank[touch.identifier];
  touchTrack.touchActive = true;
  touchTrack.previousPageX = touchTrack.currentPageX;
  touchTrack.previousPageY = touchTrack.currentPageY;
  touchTrack.previousTimeStamp = touchTrack.currentTimeStamp;
  touchTrack.currentPageX = touch.pageX;
  touchTrack.currentPageY = touch.pageY;
  touchTrack.currentTimeStamp = touch.timestamp;
  touchHistory.mostRecentTimeStamp = touch.timestamp;
};

var recordEndTouchData = function(touch) {
  var touchBank = touchHistory.touchBank;
  var touchTrack = touchBank[touch.identifier];
  touchTrack.previousPageX = touchTrack.currentPageX;
  touchTrack.previousPageY = touchTrack.currentPageY;
  touchTrack.previousTimeStamp = touchTrack.currentTimeStamp;
  touchTrack.currentPageX = touch.pageX;
  touchTrack.currentPageY = touch.pageY;
  touchTrack.currentTimeStamp = touch.timestamp;
  touchTrack.touchActive = false;
  touchHistory.mostRecentTimeStamp = touch.timestamp;
};

function toArray(collection) {
  return collection && Array.prototype.slice.call(collection) || [];
}

function normalizeTouches(touches, nativeEvent) {
  // Weex is timestamp
  let timeStamp = nativeEvent.timeStamp || nativeEvent.timestamp;

  return toArray(touches).map((touch) => {
    // Cloned touch
    return {
      clientX: touch.clientX,
      clientY: touch.clientY,
      force: touch.force,
      // FIXME: In weex android pageX/Y return a error value
      pageX: touch.screenX,
      pageY: touch.screenY,
      radiusX: touch.radiusX,
      radiusY: touch.radiusY,
      rotationAngle: touch.rotationAngle,
      screenX: touch.screenX,
      screenY: touch.screenY,
      target: touch.target || nativeEvent.target,
      timestamp: timeStamp,
      identifier: touch.identifier || 1 // MouseEvent without identifier
    };
  });
};

var ResponderTouchHistoryStore = {
  recordTouchTrack: function(topLevelType, nativeEvent) {
    var touchBank = touchHistory.touchBank;
    var changedTouches = normalizeTouches(nativeEvent.changedTouches || [nativeEvent], nativeEvent);
    if (topLevelType === 'move') {
      changedTouches.forEach(recordMoveTouchData);
    } else if (topLevelType === 'start') {
      changedTouches.forEach(recordStartTouchData);
      touchHistory.numberActiveTouches = changedTouches.length;
      if (touchHistory.numberActiveTouches === 1) {
        touchHistory.indexOfSingleActiveTouch = changedTouches[0].identifier;
      }
    } else if (topLevelType === 'end') {
      changedTouches.forEach(recordEndTouchData);
      touchHistory.numberActiveTouches = changedTouches.length;
      if (touchHistory.numberActiveTouches === 1) {
        for (var i in touchBank) {
          var touchTrackToCheck = touchBank[i];
          if (touchTrackToCheck != null && touchTrackToCheck.touchActive) {
            touchHistory.indexOfSingleActiveTouch = i;
            break;
          }
        }
      }
    }
  },

  touchHistory: touchHistory,
};

module.exports = ResponderTouchHistoryStore;
