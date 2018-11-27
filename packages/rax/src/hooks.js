import Host from './vdom/host';

function getCurrentRenderingInstance() {
  const currentInstance = Host.component._instance;
  if (currentInstance) {
    return currentInstance;
  } else {
    throw new Error('Hooks can only be called inside a component.');
  }
}

export function useState(initialState) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();
  const hooks = currentInstance.hooks;

  if (!currentInstance.isComponentRendered()) {
    // state lazy initializer
    if (typeof initialState === 'function') {
      initialState = initialState();
    }

    const setState = newState => {
      const current = hooks[hookId][0];

      if (typeof newState === 'function') {
        newState = newState(current);
      }

      if (newState !== current) {
        hooks[hookId][0] = newState;
        currentInstance.forceUpdate();
      }
    };

    hooks[hookId] = [
      initialState,
      setState,
    ];
  }

  return hooks[hookId];
}

export function useContext(context) {
  const currentInstance = getCurrentRenderingInstance();
  return currentInstance.readContext(context);
}

export function useEffect(effect, inputs) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();
  const hooks = currentInstance.hooks;

  if (!currentInstance.isComponentRendered()) {
    const create = () => {
      const { current } = create;
      if (current) {
        destory.current = current();
        create.current = null;
      }
    };

    const destory = () => {
      const { current } = destory;
      if (current) {
        current();
        destory.current = null;
      }
    };

    create.current = effect;

    currentInstance.hooks[hookId] = {
      create,
      destory,
      prevInputs: inputs,
      inputs
    };

    currentInstance.didMountHandlers.push(create);
    currentInstance.willUnmountHandlers.push(destory);

    if (!inputs) {
      currentInstance.didUpdateHandlers.push(create);
    } else if (inputs.length > 0) {
      currentInstance.didUpdateHandlers.push(() => {
        const { prevInputs, inputs } = hooks[hookId];
        if (inputs.some((data, index) => data !== prevInputs[index])) {
          create();
        }
      });
    }
  } else {
    const hook = hooks[hookId];
    const { create, destory, inputs: prevInputs = [] } = hook;
    hook.inputs = inputs;
    hook.prevInputs = prevInputs;

    if (!inputs || inputs.some((data, index) => data !== prevInputs[index])) {
      destory();
      create.current = effect;
    }
  }
}

export function useRef(initialValue) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();
  const hooks = currentInstance.hooks;

  if (!currentInstance.isComponentRendered()) {
    hooks[hookId] = {
      current: initialValue
    };
  }

  return hooks[hookId];
}

export function useCallback(callback, inputs) {
  return useMemo(() => callback, inputs);
}

export function useMemo(create, inputs) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();
  const hooks = currentInstance.hooks;

  if (!currentInstance.isComponentRendered()) {
    hooks[hookId] = [create(), inputs];
  } else {
    const hook = hooks[hookId];
    const prevInputs = hook[1];
    if (inputs.some((data, index) => data !== prevInputs[index])) {
      hook[0] = create();
    }
  }

  return hooks[hookId][0];
}

export function useReducer(reducer, initialState, initialAction) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();
  const hooks = currentInstance.hooks;

  if (!currentInstance.isComponentRendered()) {

    if (initialAction) {
      initialState = reducer(initialState, initialAction);
    }

    const dispatch = action => {
      const hook = hooks[hookId];
      const current = hook[0];
      const next = reducer(current, action);

      if (next !== current) {
        hook[0] = next;
        currentInstance.forceUpdate();
      }
    };

    hooks[hookId] = [
      initialState,
      dispatch,
    ];
  }

  return hooks[hookId];
}
