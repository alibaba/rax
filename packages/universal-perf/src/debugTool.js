import performanceNow from './performanceNow';
import getComponentTree from 'rax/lib/debug/getComponentTree';

let profiling = false;
let flushHistory = [];
let currentFlushMeasurements = [];
let currentFlushNesting = 0;
let currentTimerType = null;
let currentTimerStartTime = 0;
let lifeCycleTimerHasWarned = false;
let lifeCycleTimerStack = [];
let currentFlushStartTime = 0;
let currentTimerDebugID = null;
let roots = {};
let tree = {};
let operationHistory = [];
let currentTimerNestedFlushDuration = 0;

function begin() {
  lifeCycleTimerStack.push({
    startTime: currentTimerStartTime,
    nestedFlushStartTime: performanceNow(),
    debugID: currentTimerDebugID,
    timerType: currentTimerType,
  });
  clearTime();
}

function beginLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  currentTimerStartTime = performanceNow();
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
};

function resetMeasurements() {
  if (currentFlushNesting === 0) {
    currentFlushStartTime = 0;
    currentFlushMeasurements = [];
    return;
  }

  if (currentFlushMeasurements.length) {
    flushHistory.push({
      duration: performanceNow() - currentFlushStartTime,
      measurements: currentFlushMeasurements,
      operations: operationHistory,
      tree: tree
    });
  }

  currentFlushStartTime = performanceNow();
  currentFlushMeasurements = [];
};

function endLifeCycleTimer(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }

  if (profiling) {
    currentFlushMeasurements.push({
      timerType,
      instanceID: debugID,
      duration: performanceNow() - currentTimerStartTime - currentTimerNestedFlushDuration,
    });
  }

  clearTime();
}

function clearTime() {
  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
}

let DebugTool = {
  getRoots() {
    return roots;
  },
  getTree() {
    return tree;
  },
  beginProfiling() {
    if (profiling) {
      return;
    }

    profiling = true;
    flushHistory = [];
    resetMeasurements();
  },
  getFlushHistory() {
    return flushHistory;
  },
  endProfiling() {
    if (!profiling) {
      return;
    }

    profiling = false;
    resetMeasurements();
  },
  onBeginFlush() {
    currentFlushNesting++;
    resetMeasurements();
    begin();
  },
  onEndFlush() {
    resetMeasurements();
    currentFlushNesting--;
  },
  onBeginLifeCycleTimer(debugID, timerType) {
    beginLifeCycleTimer(debugID, timerType);
  },
  onEndLifeCycleTimer(debugID, timerType) {
    endLifeCycleTimer(debugID, timerType);
  },

  onBeforeMountComponent(debugID, element) {
    tree[debugID] = element;

    // root
    if (element.getName() === 'Root') {
      roots[debugID] = element;
    }
  },
  onMountComponent(debugID) {
    const item = tree[debugID];
    item.isMounted = true;
  },
  onBeforeUpdateComponent(debugID, element) {
    const item = tree[debugID];
    if (!item || !item.isMounted) {
      return;
    }
    item.element = element;
  },
  onUpdateComponent(debugID) {
    const item = tree[debugID];
    if (!item || !item.isMounted) {
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent(debugID) {
    const item = tree[debugID];
    if (item) {
      item.isMounted = false;
    }
  },
  onHostOperation(operation) {
    operationHistory.push(operation);
  }
};

export default DebugTool;
