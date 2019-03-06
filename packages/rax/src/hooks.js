import Host from './vdom/host';
import { schedule, flush } from './vdom/scheduler';
import { is } from './vdom/shallowEqual';

function getCurrentRenderingInstance() {
  const currentInstance = Host.owner._instance;
  if (currentInstance) {
    return currentInstance;
  } else {
    throw Error('Hooks can only be called inside a component.');
  }
}

function areInputsEqual(inputs, prevInputs) {
  if (prevInputs === null || inputs.length !== prevInputs.length) {
    return false;
  }

  for (let i = 0; i < inputs.length; i++) {
    if (is(inputs[i], prevInputs[i])) {
      continue;
    }
    return false;
  }
  return true;
}

export function useState(initialState) {
  const currentInstance = getCurrentRenderingInstance();
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();

  if (!hooks[hookID]) {
    // state lazy initializer
    if (typeof initialState === 'function') {
      initialState = initialState();
    }

    const setState = newState => {
      const eagerState = hooks[hookID][2];

      if (typeof newState === 'function') {
        newState = newState(eagerState);
      }

      if (!is(newState, eagerState)) {
        // This is a render phase update.  After this render pass, we'll restart
        if (Host.owner && Host.owner._instance === currentInstance) {
          hooks[hookID][2] = newState;
          currentInstance.isScheduled = true;
        } else {
          !Host.isUpdating && flush();
          hooks[hookID][2] = newState;
          currentInstance.update();
        }
      }
    };

    hooks[hookID] = [
      initialState,
      setState,
      initialState
    ];
  }
  if (!is(hooks[hookID][0], hooks[hookID][2])) {
    hooks[hookID][0] = hooks[hookID][2];
    currentInstance.didReceiveUpdate = true;
  }
  return hooks[hookID];
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
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();
  inputs = inputs === undefined ? null : inputs;

  if (!hooks[hookID]) {
    const create = (immediately) => {
      if (!immediately && defered) return schedule(() => create(true));
      const { current } = create;
      if (current) {
        // Set this to true to prevent re-entrancy
        const previousIsRendering = Host.isUpdating;
        Host.isUpdating = true;
        destory.current = current();
        create.current = null;
        Host.isUpdating = previousIsRendering;
      }
    };

    const destory = (immediately) => {
      if (!immediately && defered) return schedule(() => destory(true));
      const { current } = destory;
      if (current) {
        // Set this to true to prevent re-entrancy
        const previousIsRendering = Host.isUpdating;
        Host.isUpdating = true;
        current();
        destory.current = null;
        Host.isUpdating = previousIsRendering;
      }
    };

    create.current = effect;

    hooks[hookID] = {
      create,
      destory,
      prevInputs: inputs,
      inputs
    };

    currentInstance.didMount.push(create);
    currentInstance.willUnmount.push(destory);
    currentInstance.didUpdate.push(() => {
      const { prevInputs, inputs, create } = hooks[hookID];
      if (inputs == null || !areInputsEqual(inputs, prevInputs)) {
        destory();
        create();
      }
    });
  } else {
    const hook = hooks[hookID];
    const { create, inputs: prevInputs } = hook;
    hook.inputs = inputs;
    hook.prevInputs = prevInputs;
    create.current = effect;
  }
}

export function useImperativeHandle(ref, create, inputs) {
  const nextInputs = inputs != null ? inputs.concat([ref]) : null;

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
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();

  if (!hooks[hookID]) {
    hooks[hookID] = {
      current: initialValue
    };
  }

  return hooks[hookID];
}

export function useCallback(callback, inputs) {
  return useMemo(() => callback, inputs);
}

export function useMemo(create, inputs) {
  const currentInstance = getCurrentRenderingInstance();
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();
  inputs = inputs === undefined ? null : inputs;

  if (!hooks[hookID]) {
    hooks[hookID] = [create(), inputs];
  } else {
    const prevInputs = hooks[hookID][1];
    if (inputs === null || !areInputsEqual(inputs, prevInputs)) {
      hooks[hookID] = [create(), inputs];
    }
  }

  return hooks[hookID][0];
}

export function useReducer(reducer, initialArg, init) {
  const currentInstance = getCurrentRenderingInstance();
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();

  if (!hooks[hookID]) {
    const initialState = init !== undefined ? init(initialArg) : initialArg;

    const dispatch = action => {
      const hook = hooks[hookID];
      // reducer will update in the next render, before that we add all
      // actions to the queue
      const queue = hook[2];
      // This is a render phase update.  After this render pass, we'll restart
      if (Host.owner && Host.owner._instance === currentInstance) {
        queue.actions.push(action);
        currentInstance.isScheduled = true;
      } else {
        !Host.isUpdating && flush();

        const currentState = queue.eagerState;
        const eagerReducer = queue.eagerReducer;
        const eagerState = eagerReducer(currentState, action);
        if (is(eagerState, currentState)) {
          return;
        }
        queue.eagerState = eagerState;
        queue.actions.push(action);
        currentInstance.update();
      }
    };

    return hooks[hookID] = [
      initialState,
      dispatch,
      {
        actions: [],
        eagerReducer: reducer,
        eagerState: initialState
      }
    ];
  }
  const hook = hooks[hookID];
  const queue = hook[2];
  let next = hook[0];

  if (currentInstance._reRenders > 0 || queue.eagerReducer != reducer) {
    for (let i = 0; i < queue.actions.length; i++) {
      next = reducer(next, queue.actions[i]);
    }
  } else {
    next = queue.eagerState;
  }

  if (!is(next, hook[0])) {
    hook[0] = next;
    currentInstance.didReceiveUpdate = true;
  }

  queue.eagerReducer = reducer;
  queue.eagerState = next;
  queue.actions.length = 0;
  return hooks[hookID];
}
