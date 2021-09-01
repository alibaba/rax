import Host from './host';
import { flushEffect, schedule, flushLayout } from './scheduler';
import { INTERNAL, RENDERED_COMPONENT } from '../constant';

// Dirty components store
let dirtyComponents = [];

function getPendingCallbacks(internal) {
  return internal.__pendingCallbacks;
}

function setPendingCallbacks(internal, callbacks) {
  return internal.__pendingCallbacks = callbacks;
}

function getPendingStateQueue(internal) {
  return internal.__pendingStateQueue;
}

function setPendingStateQueue(internal, partialState) {
  return internal.__pendingStateQueue = partialState;
}

function enqueueCallback(internal, callback) {
  let callbackQueue = getPendingCallbacks(internal) || setPendingCallbacks(internal, []);
  callbackQueue.push(callback);
}

function enqueueState(internal, partialState) {
  let stateQueue = getPendingStateQueue(internal) || setPendingStateQueue(internal, []);
  stateQueue.push(partialState);
}

function runUpdate(component) {
  let internal = component[INTERNAL];
  if (!internal) {
    return;
  }

  Host.__isUpdating = true;

  let prevElement = internal.__currentElement;
  let prevUnmaskedContext = internal._context;
  let nextUnmaskedContext = internal.__penddingContext || prevUnmaskedContext;
  internal.__penddingContext = undefined;

  if (getPendingStateQueue(internal) || internal.__isPendingForceUpdate) {
    internal.__updateComponent(
      prevElement,
      prevElement,
      prevUnmaskedContext,
      nextUnmaskedContext
    );

    flushLayout();
  }

  Host.__isUpdating = false;
}

function mountOrderComparator(c1, c2) {
  return c2[INTERNAL]._mountID - c1[INTERNAL]._mountID;
}

function performUpdate() {
  if (Host.__isUpdating) {
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
      dirties = dirties.filter(c => !!c[INTERNAL]).sort(mountOrderComparator);
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
    // If have been scheduled before, do not need schedule again
    if (dirtyComponents.length > 1) {
      return;
    }
    schedule(performUpdate);
  } else {
    performUpdate();
  }
}

function requestUpdate(component, partialState, callback) {
  let internal = component[INTERNAL];

  if (!internal) {
    if (process.env.NODE_ENV !== 'production') {
      // Block other render
      Host.__isUpdating = false;
      console.error(
        "Warning: Can't perform a Rax state update on an unmounted component. This " +
          'is a no-op, but it indicates a memory leak in your application. To ' +
          'fix, cancel all subscriptions and asynchronous tasks in %s.',
        component.__isReactiveComponent
          ? 'a useEffect cleanup function'
          : 'the componentWillUnmount method',
      );
    }
    return;
  }

  if (callback) {
    enqueueCallback(internal, callback);
  }

  const hasComponentRendered = internal[RENDERED_COMPONENT];

  // setState
  if (partialState) {
    // Function Component should force update
    if (component.__isReactiveComponent) {
      internal.__isPendingForceUpdate = true;
    }
    enqueueState(internal, partialState);
    // State pending when request update in componentWillMount and componentWillReceiveProps,
    // isPendingState default is false value (false or null) and set to true after componentWillReceiveProps,
    // _renderedComponent is null when componentWillMount exec.
    if (!internal.__isPendingState && hasComponentRendered) {
      scheduleUpdate(component, true);
    }
  } else {
    // forceUpdate
    internal.__isPendingForceUpdate = true;

    if (hasComponentRendered) {
      scheduleUpdate(component);
    }
  }
}

const Updater = {
  setState(component, partialState, callback) {
    // Flush all effects first before update state
    if (!Host.__isUpdating) {
      flushEffect();
    }
    requestUpdate(component, partialState, callback);
  },
  forceUpdate(component, callback) {
    requestUpdate(component, null, callback);
  }
};

export default Updater;
