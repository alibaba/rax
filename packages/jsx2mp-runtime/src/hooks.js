// eslint-disable-next-line import/no-extraneous-dependencies
import { isQuickApp, isByteDanceMicroApp, isWeChatMiniProgram } from 'universal-env';
import Host from './host';
import { scheduleEffect, invokeEffects } from './scheduler';
import { is } from './shallowEqual';
import { isFunction, isNull, isUndef } from './types';
import { COMPONENT_DID_MOUNT, COMPONENT_DID_UPDATE, COMPONENT_WILL_UNMOUNT } from './cycles';
import { enqueueRender } from './enqueueRender';
import createRef from './createRef';

export function getCurrentInstance() {
  return Host.current;
}

function getCurrentRenderingInstance() {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    return currentInstance;
  } else {
    throw Error('Hooks can only be called inside a component.');
  }
}

function areInputsEqual(inputs, prevInputs) {
  if (isNull(prevInputs) || inputs.length !== prevInputs.length) {
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

function setWrapperRef(instance, ref, create) {
  if (isWeChatMiniProgram || isByteDanceMicroApp) {
    if (ref) {
      instance._internal.triggerEvent('ComRef', create());
    }
    return () => instance._internal.triggerEvent('ComRef', null);
  } else if (!isNull(ref)) {
    ref.current = create();
    return () => {
      ref.current = null;
    };
  }
}

export function useState(initialState) {
  const currentInstance = getCurrentRenderingInstance();
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();

  if (!hooks[hookID]) {
    // If the initial state is the result of an expensive computation,
    // you may provide a function instead for lazy initial state.
    if (isFunction(initialState)) {
      initialState = initialState();
    }

    const setState = newState => {
      // Invoke all effects first before update state
      if (!Host.isUpdating) {
        invokeEffects();
      }

      const hook = hooks[hookID];
      const eagerState = hook[2];
      // function updater
      if (isFunction(newState)) {
        newState = newState(eagerState);
      }

      if (!is(newState, eagerState)) {
        // Current instance is in render update phase.
        // After this one render finish, will continue run.
        hook[2] = newState;
        // Mark need update
        currentInstance.__shouldUpdate = true;
        enqueueRender(currentInstance);
      }
    };

    hooks[hookID] = [
      initialState,
      setState,
      initialState
    ];
  }

  const hook = hooks[hookID];
  if (!is(hook[0], hook[2])) {
    hook[0] = hook[2];
    currentInstance.__shouldUpdate = true;
  }

  return hook;
}

export function useContext(context) {
  const currentInstance = getCurrentRenderingInstance();
  return currentInstance._readContext(context);
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
      if (!immediately && defered) return scheduleEffect(() => create(true));
      const { current } = create;
      if (current) {
        destory.current = current();
        create.current = null;
      }
    };

    const destory = (immediately) => {
      if (!immediately && defered) return scheduleEffect(() => destory(true));
      const { current } = destory;
      if (current) {
        current();
        destory.current = null;
      }
    };

    create.current = effect;

    hooks[hookID] = {
      create,
      destory,
      prevInputs: inputs,
      inputs
    };
    currentInstance._registerLifeCycle(COMPONENT_DID_MOUNT, create);
    currentInstance._registerLifeCycle(COMPONENT_WILL_UNMOUNT, destory);
    currentInstance._registerLifeCycle(COMPONENT_DID_UPDATE, () => {
      const { prevInputs, inputs, create } = hooks[hookID];
      if (isNull(inputs) || !areInputsEqual(inputs, prevInputs)) {
        destory();
        create();
      }
    });
  } else {
    const hook = hooks[hookID];
    const { create, inputs: prevInputs, destory } = hook;
    hook.inputs = inputs;
    hook.prevInputs = prevInputs;
    create.current = effect;
  }
}

export function useImperativeHandle(ref, create, inputs) {
  const nextInputs = !isNull(inputs) && !isUndef(inputs) ? inputs.concat([ref]) : null;
  const currentInstance = getCurrentRenderingInstance();
  const mounted = currentInstance.__mounted;
  let willUnmountFn;

  if (!currentInstance.mounted) {
    willUnmountFn = setWrapperRef(currentInstance, ref, create);
  }
  useLayoutEffect(() => {
    if (mounted) {
      willUnmountFn = setWrapperRef(currentInstance, ref, create);
    }
    return willUnmountFn;
  }, nextInputs);
}

export function useRef(initialValue, name) {
  const currentInstance = getCurrentRenderingInstance();
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();

  if (isQuickApp) {
    return currentInstance._internal.$element(name) || {};
  }

  if (!hooks[hookID]) {
    // currentInstance._internal.,
    hooks[hookID] = createRef(initialValue);
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
      // invoke all effects first before update state
      if (!Host.isUpdating) {
        invokeEffects();
      }

      const hook = hooks[hookID];
      // Reducer will update in the next render, before that we add all
      // actions to the queue
      const queue = hook[2];
      const currentState = queue.eagerState;
      const eagerReducer = queue.eagerReducer;
      const eagerState = eagerReducer(currentState, action);
      if (is(eagerState, currentState)) {
        return;
      }
      queue.actions.push(action);
      queue.eagerState = eagerState;
      enqueueRender(currentInstance);
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

  if (currentInstance._reRenders > 0) {
    for (let i = 0; i < queue.actions.length; i++) {
      next = reducer(next, queue.actions[i]);
    }
  } else {
    next = queue.eagerState;
  }

  if (!is(next, hook[0])) {
    hook[0] = next;
    currentInstance.__shouldUpdate = true;
  }

  queue.eagerReducer = reducer;
  queue.eagerState = next;
  queue.actions.length = 0;
  return hooks[hookID];
}
