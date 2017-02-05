import HostOperationHistoryHook from './hooks/HostOperationHistoryHook';
import InvalidSetStateWarningHook from './hooks/InvalidSetStateWarningHook';
import ComponentTreeHook from './hooks/ComponentTreeHook';
import ExecutionEnvironment from './ExecutionEnvironment';

let performance =
    window.performance ||
    window.msPerformance ||
    window.webkitPerformance;

let canUsePerformanceMeasure =
  typeof performance !== 'undefined' &&
  typeof performance.mark === 'function' &&
  typeof performance.clearMarks === 'function' &&
  typeof performance.measure === 'function' &&
  typeof performance.clearMeasures === 'function';

const performanceNow = () => {
  return performance.now();
};

let profiling = false;
let flushHistory = [];
let hooks = [];
let lifeCycleTimerStack = [];
let currentTimerStartTime = 0;
let currentTimerNestedFlushDuration = 0;
let currentTimerType = null;
let currentTimerDebugID = null;
let lifeCycleTimerHasWarned = false;

const clearHistory = () => {
  ComponentTreeHook.purgeUnmountedComponents();
  HostOperationHistoryHook.clearHistory();
};

let currentFlushStartTime = 0;
let currentFlushMeasurements = [];
let currentFlushNesting = 0;

let didHookThrowForEvent = {};

function callHook(event, fn, context, arg1, arg2, arg3, arg4, arg5) {
  try {
    fn.call(context, arg1, arg2, arg3, arg4, arg5);
  } catch (e) {
    console.warn('Exception thrown by hook while handling %s: %s', event)
    didHookThrowForEvent[event] = true;
  }
}

function emitEvent(event, arg1, arg2, arg3, arg4, arg5) {
  for (let i = 0; i < hooks.length; i++) {
    const hook = hooks[i];
    const fn = hook[event];
    if (fn) {
      callHook(event, fn, hook, arg1, arg2, arg3, arg4, arg5);
    }
  }
}

function checkDebugID(debugID, allowRoot = false) {
  if (allowRoot && debugID === 0) {
    return;
  }
  if (!debugID) {
    console.warn('DebugTool: debugID may not be empty.')
  }
}

function shouldMark(debugID) {
  if (!profiling || !canUsePerformanceMeasure) {
    return false;
  }
  const element = ComponentTreeHook.getElement(debugID);
  if (element == null || typeof element !== 'object') {
    return false;
  }
  const isHostElement = typeof element.type === 'string';
  if (isHostElement) {
    return false;
  }
  return true;
}

const getTreeSnapshot = (registeredIDs) => {
  return registeredIDs.reduce((tree, id) => {
    const ownerID = ComponentTreeHook.getOwnerID(id);
    const parentID = ComponentTreeHook.getParentID(id);
    tree[id] = {
      displayName: ComponentTreeHook.getDisplayName(id),
      text: ComponentTreeHook.getText(id),
      updateCount: ComponentTreeHook.getUpdateCount(id),
      childIDs: ComponentTreeHook.getChildIDs(id),
      ownerID: ownerID ||
        parentID && ComponentTreeHook.getOwnerID(parentID) ||
        0,
      parentID,
    };
    return tree;
  }, {});
};
const resetMeasurements = () => {
  const previousStartTime = currentFlushStartTime;
  const previousMeasurements = currentFlushMeasurements;
  const previousOperations = HostOperationHistoryHook.getHistory();

  if (currentFlushNesting === 0) {
    currentFlushStartTime = 0;
    currentFlushMeasurements = [];
    clearHistory();
    return;
  }

  if (previousMeasurements.length || previousOperations.length) {
    const registeredIDs = ComponentTreeHook.getRegisteredIDs();
    flushHistory.push({
      duration: performanceNow() - previousStartTime,
      measurements: previousMeasurements || [],
      operations: previousOperations || [],
      treeSnapshot: getTreeSnapshot(registeredIDs),
    });
  }

  clearHistory();
  currentFlushStartTime = performanceNow();
  currentFlushMeasurements = [];
};

function resumeCurrentLifeCycleTimer() {
  const {startTime, nestedFlushStartTime, debugID, timerType} = lifeCycleTimerStack.pop();
  const nestedFlushDuration = performanceNow() - nestedFlushStartTime;
  currentTimerStartTime = startTime;
  currentTimerNestedFlushDuration += nestedFlushDuration;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
}

const beginLifeCycleTimer = function(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  if (currentTimerType && !lifeCycleTimerHasWarned) {
    console.warn('There is an internal error in the React performance measurement code.');
    lifeCycleTimerHasWarned = true;
  }
  currentTimerStartTime = performanceNow();
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = debugID;
  currentTimerType = timerType;
};

const endLifeCycleTimer = function(debugID, timerType) {
  if (currentFlushNesting === 0) {
    return;
  }
  if (currentTimerType !== timerType && !lifeCycleTimerHasWarned) {
    console.warn('There is an internal error in the React performance measurement code.');
    lifeCycleTimerHasWarned = true;
  }
  if (profiling) {
    currentFlushMeasurements.push({
      timerType,
      instanceID: debugID,
      duration: performanceNow() - currentTimerStartTime - currentTimerNestedFlushDuration,
    });
  }
  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
};

const pauseCurrentLifeCycleTimer = () => {
  const currentTimer = {
    startTime: currentTimerStartTime,
    nestedFlushStartTime: performanceNow(),
    debugID: currentTimerDebugID,
    timerType: currentTimerType,
  };
  lifeCycleTimerStack.push(currentTimer);
  currentTimerStartTime = 0;
  currentTimerNestedFlushDuration = 0;
  currentTimerDebugID = null;
  currentTimerType = null;
};

function markBegin(debugID, markType) {
  if (!shouldMark(debugID)) {
    return;
  }

  const markName = `${debugID}::${markType}`;
  lastMarkTimeStamp = performanceNow();
  performance.mark(markName);
}

function markEnd(debugID, markType) {
  if (!shouldMark(debugID)) {
    return;
  }

  const markName = `${debugID}::${markType}`;
  const displayName = ComponentTreeHook.getDisplayName(debugID) || 'Unknown';

  const timeStamp = performanceNow();
  if (timeStamp - lastMarkTimeStamp > 0.1) {
    var measurementName = `${displayName} [${markType}]`;
    performance.measure(measurementName, markName);
  }

  performance.clearMarks(markName);
  performance.clearMeasures(measurementName);
}

let DebugTool = {
  addHook(hook) {
    hooks.push(hook);
  },
  removeHook(hook: Hook) {
    for (let i = 0; i < hooks.length; i++) {
      if (hooks[i] === hook) {
        hooks.splice(i, 1);
        i--;
      }
    }
  },
  getFlushHistory() {
    return flushHistory;
  },
  beginProfiling() {
    if (profiling) {
      return;
    }

    profiling = true;
    flushHistory.length = 0;
    resetMeasurements();
    DebugTool.addHook(HostOperationHistoryHook);
  },
  endProfiling() {
    if (!profiling) {
      return;
    }

    profiling = false;
    resetMeasurements();
    DebugTool.removeHook(HostOperationHistoryHook);
  },
  isProfiling() {
    return profiling;
  },
  FlushHistory: [],
  onBeginFlush() {
    currentFlushNesting++;
    resetMeasurements();
    pauseCurrentLifeCycleTimer();
    emitEvent('onBeginFlush');
  },
  onEndFlush() {
    resetMeasurements();
    currentFlushNesting--;
    resumeCurrentLifeCycleTimer();
    emitEvent('onEndFlush');
  },
  onBeginLifeCycleTimer(debugID, timerType) {
    checkDebugID(debugID);
    emitEvent('onBeginLifeCycleTimer', debugID, timerType);
    markBegin(debugID, timerType);
    beginLifeCycleTimer(debugID, timerType);
  },
  onEndLifeCycleTimer(debugID, timerType) {
    checkDebugID(debugID);
    endLifeCycleTimer(debugID, timerType);
    markEnd(debugID, timerType);
  },
  onBeginProcessingChildContext() {
    emitEvent('onBeginProcessingChildContext');
  },
  onEndProcessingChildContext() {
    emitEvent('onEndProcessingChildContext');
  },
  onHostOperation(operation) {
    checkDebugID(operation.instanceID);
    emitEvent('onHostOperation', operation);
  },
  onSetState() {
    emitEvent('onSetState');
  },
  onSetChildren(debugID, childDebugIDs) {
    checkDebugID(debugID);
    childDebugIDs.forEach(checkDebugID);
    emitEvent('onSetChildren', debugID, childDebugIDs);
  },
  onBeforeMountComponent(debugID, element, parentDebugID) {
    checkDebugID(debugID);
    // checkDebugID(parentDebugID, true);
    emitEvent('onBeforeMountComponent', debugID, element, parentDebugID);
    markBegin(debugID, 'mount');
  },
  onMountComponent(debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'mount');
    emitEvent('onMountComponent', debugID);
  },
  onBeforeUpdateComponent(debugID, element) {
    checkDebugID(debugID);
    emitEvent('onBeforeUpdateComponent', debugID, element);
    markBegin(debugID, 'update');
  },
  onUpdateComponent(debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'update');
    emitEvent('onUpdateComponent', debugID);
  },
  onBeforeUnmountComponent(debugID) {
    checkDebugID(debugID);
    markBegin(debugID, 'unmount');
    emitEvent('onBeforeUnmountComponent', debugID);
  },
  onUnmountComponent(debugID) {
    checkDebugID(debugID);
    markEnd(debugID, 'unmount');
    emitEvent('onUnmountComponent', debugID);
  },
  onTestEvent() {
    emitEvent('onTestEvent');
  }
};

DebugTool.addHook(InvalidSetStateWarningHook);
DebugTool.addHook(ComponentTreeHook);

export default DebugTool;
