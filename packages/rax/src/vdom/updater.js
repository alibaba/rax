import Host from './host';
import { flushEffect, schedule } from './scheduler';

// Dirty components store
let dirtyComponents = [];

function getPendingCallbacks(internal) {
  return internal._pendingCallbacks;
}

function setPendingCallbacks(internal, callbacks) {
  return internal._pendingCallbacks = callbacks;
}

function getPendingStateQueue(internal) {
  return internal._pendingStateQueue;
}

function setPendingStateQueue(internal, partialState) {
  return internal._pendingStateQueue = partialState;
}

function enqueueCallback(internal, callback) {
  let callbackQueue = getPendingCallbacks(internal) || setPendingCallbacks(internal, []);
  callbackQueue.push(callback);
}

function enqueueState(internal, partialState) {
  let stateQueue = getPendingStateQueue(internal) || setPendingStateQueue(internal, []);
  stateQueue.push(partialState);
}

function runCallbacks(callbacks, context) {
  if (callbacks) {
    for (let i = 0; i < callbacks.length; i++) {
      callbacks[i].call(context);
    }
  }
}

function runUpdate(component) {
  let internal = component._internal;
  if (!internal) {
    return;
  }

  Host.isUpdating = true;

  // If updateComponent happens to enqueue any new updates, we
  // shouldn't execute the callbacks until the next render happens, so
  // stash the callbacks first
  let callbacks = getPendingCallbacks(internal);
  setPendingCallbacks(internal, null);

  let prevElement = internal._currentElement;
  let prevUnmaskedContext = internal._context;
  let nextUnmaskedContext = internal._penddingContext || prevUnmaskedContext;
  internal._penddingContext = undefined;

  if (getPendingStateQueue(internal) || internal._isPendingForceUpdate) {
    internal.updateComponent(
      prevElement,
      prevElement,
      prevUnmaskedContext,
      nextUnmaskedContext
    );
  }

  runCallbacks(callbacks, component);

  Host.isUpdating = false;
}

function mountOrderComparator(c1, c2) {
  return c2._internal._mountID - c1._internal._mountID;
}

function performUpdate() {
  if (Host.isUpdating) {
    return schedule(performUpdate);
  }

  let component;
  let dirties = dirtyComponents;
  if (dirties.length > 0) {
    // Before next render, we will flush all the effects
    flushEffect();
    dirtyComponents = [];
    // Since reconciling a component higher in the owner hierarchy usually (not
    // always -- see shouldComponentUpdate()) will reconcile children, reconcile
    // them before their children by sorting the array.
    if (dirties.length > 1) {
      dirties = dirties.sort(mountOrderComparator);
    }

    while (component = dirties.pop()) {
      runUpdate(component);
    }
  }
}

function scheduleUpdate(component, shouldAsyncUpdate) {
  if (dirtyComponents.indexOf(component) < 0) {
    dirtyComponents.push(component);
  }

  if (shouldAsyncUpdate) {
    // If have been scheduled before, don't not need schedule again
    if (dirtyComponents.length > 1) {
      return;
    }
    schedule(performUpdate);
  } else {
    performUpdate();
  }
}

function requestUpdate(component, partialState, callback) {
  let internal = component._internal;

  if (!internal) {
    return;
  }

  if (callback) {
    enqueueCallback(internal, callback);
  }

  const hasComponentRendered = internal._renderedComponent;

  // setState
  if (partialState) {
    enqueueState(internal, partialState);
    // State pending when request update in componentWillMount and componentWillReceiveProps,
    // isPendingState default is false value (false or null) and set to true after componentWillReceiveProps,
    // _renderedComponent is null when componentWillMount exec.
    if (!internal._isPendingState && hasComponentRendered) {
      scheduleUpdate(component, true);
    }
  } else {
    // forceUpdate
    internal._isPendingForceUpdate = true;

    if (hasComponentRendered) {
      scheduleUpdate(component);
    }
  }
}

const Updater = {
  setState: function(component, partialState, callback) {
    // Flush all effects first before update state
    if (!Host.isUpdating) {
      flushEffect();
    }
    requestUpdate(component, partialState, callback);
  },
  forceUpdate: function(component, callback) {
    requestUpdate(component, null, callback);
  },
  runCallbacks: runCallbacks
};

export default Updater;
