function enqueueCallback(internal, callback) {
  if (callback) {
    let callbackQueue =
      internal._pendingCallbacks ||
      (internal._pendingCallbacks = []);
    callbackQueue.push(callback);
  }
}

function enqueueState(internal, partialState) {
  if (partialState) {
    let stateQueue =
      internal._pendingStateQueue ||
      (internal._pendingStateQueue = []);
    stateQueue.push(partialState);
  }
}

const Updater = {
  setState: function(component, partialState, callback) {
    let internal = component._internal;

    if (!internal) {
      return;
    }

    enqueueState(internal, partialState);
    enqueueCallback(internal, callback);

    if (!internal._pendingState) {
      this.runUpdate(component);
    }
  },

  forceUpdate: function(component, callback) {
    let internal = component._internal;

    if (!internal) {
      return;
    }

    internal._pendingForceUpdate = true;

    enqueueCallback(internal, callback);
    this.runUpdate(component);
  },

  runUpdate: function(component) {
    let internal = component._internal;

    if (!internal || !internal._renderedComponent) {
      return;
    }

    // If updateComponent happens to enqueue any new updates, we
    // shouldn't execute the callbacks until the next render happens, so
    // stash the callbacks first
    let callbacks = internal._pendingCallbacks;
    internal._pendingCallbacks = null;

    let prevElement = internal._currentElement;
    let prevUnmaskedContext = internal._context;

    if (internal._pendingStateQueue || internal._pendingForceUpdate) {
      internal.updateComponent(
        prevElement,
        prevElement,
        prevUnmaskedContext,
        prevUnmaskedContext
      );
    }

    this.runCallbacks(callbacks, component);
  },

  runCallbacks(callbacks, context) {
    if (callbacks) {
      for (let i = 0; i < callbacks.length; i++) {
        callbacks[i].call(context);
      }
    }
  }

};

export default Updater;
