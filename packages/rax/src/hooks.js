import Host from './vdom/host';

function getCurrentRenderingInstance() {
  const currentInstance = Host.component._instance;
  if (currentInstance) {
    return currentInstance;
  } else {
    throw new Error('Hooks can only be called inside a component.');
  }
}

function areInputsEqual(inputs, prevInputs) {
  for (let i = 0; i < inputs.length; i++) {
    const val1 = inputs[i];
    const val2 = prevInputs[i];
    if (
      val1 === val2 && (val1 !== 0 || 1 / val1 === 1 / val2) ||
      val1 !== val1 && val2 !== val2 // eslint-disable-line no-self-compare
    ) {
      continue;
    }
    return false;
  }
  return true;
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
        currentInstance.update();
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
  useEffectImpl(effect, inputs, true);
}

export function useLayoutEffect(effect, inputs) {
  useEffectImpl(effect, inputs);
}

function useEffectImpl(effect, inputs, defered) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();
  const hooks = currentInstance.hooks;

  if (!currentInstance.isComponentRendered()) {
    const create = (immediately) => {
      if (!immediately && defered) return setTimeout(() => create(true));
      const { current } = create;
      if (current) {
        destory.current = current();
        create.current = null;
      }
    };

    const destory = (immediately) => {
      if (!immediately && defered) return setTimeout(() => destory(true));
      const { current } = destory;
      if (current) {
        current();
        destory.current = null;
      } else if (defered) {
        create(true);
        destory(true);
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
    currentInstance.didUpdateHandlers.push(() => {
      const { prevInputs, inputs, create } = hooks[hookId];
      if (prevInputs == null || !areInputsEqual(inputs, prevInputs)) {
        destory(true);
        create();
      }
    });
  } else {
    const hook = hooks[hookId];
    const { create, inputs: prevInputs } = hook;
    hook.inputs = inputs;
    hook.prevInputs = prevInputs;
    create.current = effect;
  }
}

export function useImperativeMethods(ref, create, inputs) {
  const nextInputs = inputs != null ? inputs.concat([ref]) : [ref, create];

  useLayoutEffect(() => {
    if (typeof ref === 'function') {
      ref(create());
      return () => ref(null);
    } else if (ref != null) {
      ref.current = create();
      return () => {
        ref.current = null;
      };
    }
  }, nextInputs);
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
    if (!areInputsEqual(inputs, prevInputs)) {
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
        currentInstance.update();
      }
    };

    hooks[hookId] = [
      initialState,
      dispatch,
    ];
  }

  return hooks[hookId];
}
