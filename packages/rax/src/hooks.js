import Host from './vdom/host';
import { scheduleEffect, flushEffect } from './vdom/scheduler';
import { is } from './vdom/shallowEqual';
import { isArray, isFunction, isNull } from './types';
import { warning, throwError, throwMinifiedError } from './error';
import { INSTANCE } from './constant';

function getCurrentInstance() {
  return Host.owner && Host.owner[INSTANCE];
}

function getCurrentRenderingInstance() {
  const currentInstance = getCurrentInstance();
  if (currentInstance) {
    return currentInstance;
  } else {
    if (process.env.NODE_ENV !== 'production') {
      throwError('Hooks called outside a component, or multiple version of Rax are used.');
    } else {
      throwMinifiedError(1);
    }
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
      // Flush all effects first before update state
      if (!Host.__isUpdating) {
        flushEffect();
      }

      const hook = hooks[hookID];
      const eagerState = hook[2];
      // function updater
      if (isFunction(newState)) {
        newState = newState(eagerState);
      }

      if (!is(newState, eagerState)) {
        // Current instance is in render update phase.
        // After this one render finish, will containue run.
        hook[2] = newState;
        if (getCurrentInstance() === currentInstance) {
          // Marked as is scheduled that could finish hooks.
          currentInstance.__isScheduled = true;
        } else {
          currentInstance.__update();
        }
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
  return currentInstance.useContext(context);
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
    const __create = (immediately) => {
      if (!immediately && defered) return scheduleEffect(() => __create(true));
      const { current } = __create;
      if (current) {
        __destory.current = current();
        __create.current = null;

        if (process.env.NODE_ENV !== 'production') {
          const currentDestory = __destory.current;
          if (currentDestory !== undefined && typeof currentDestory !== 'function') {
            let msg;
            if (currentDestory === null) {
              msg =
                ' You returned null. If your effect does not require clean ' +
                'up, return undefined (or nothing).';
            } else if (typeof currentDestory.then === 'function') {
              msg =
                '\n\nIt looks like you wrote useEffect(async () => ...) or returned a Promise. ' +
                'Instead, write the async function inside your effect ' +
                'and call it immediately:\n\n' +
                'useEffect(() => {\n' +
                '  async function fetchData() {\n' +
                '    // You can await here\n' +
                '    const response = await MyAPI.getData(someId);\n' +
                '    // ...\n' +
                '  }\n' +
                '  fetchData();\n' +
                '}, [someId]); // Or [] if effect doesn\'t need props or state.';
            } else {
              msg = ' You returned: ' + currentDestory;
            }

            warning(
              'An effect function must not return anything besides a function, ' +
              'which is used for clean-up.' + msg,
            );
          }
        }
      }
    };

    const __destory = (immediately) => {
      if (!immediately && defered) return scheduleEffect(() => __destory(true));
      const { current } = __destory;
      if (current) {
        current();
        __destory.current = null;
      }
    };

    __create.current = effect;

    hooks[hookID] = {
      __create,
      __destory,
      __prevInputs: inputs,
      __inputs: inputs
    };

    currentInstance.didMount.push(__create);
    currentInstance.willUnmount.push(() => __destory(true));
    currentInstance.didUpdate.push(() => {
      const { __prevInputs, __inputs, __create } = hooks[hookID];
      if (__inputs == null || !areInputsEqual(__inputs, __prevInputs)) {
        __destory();
        __create();
      }
    });
  } else {
    const hook = hooks[hookID];
    const { __create, __inputs: prevInputs } = hook;
    hook.__inputs = inputs;
    hook.__prevInputs = prevInputs;
    __create.current = effect;
  }
}

export function useImperativeHandle(ref, create, inputs) {
  const nextInputs = isArray(inputs) ? inputs.concat([ref]) : null;

  useLayoutEffect(() => {
    if (isFunction(ref)) {
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
    if (isNull(inputs) || !areInputsEqual(inputs, prevInputs)) {
      hooks[hookID] = [create(), inputs];
    }
  }

  return hooks[hookID][0];
}

export function useReducer(reducer, initialArg, init) {
  const currentInstance = getCurrentRenderingInstance();
  const hookID = currentInstance.getHookID();
  const hooks = currentInstance.getHooks();
  const hook = hooks[hookID];

  if (!hook) {
    const initialState = isFunction(init) ? init(initialArg) : initialArg;

    const dispatch = action => {
      // Flush all effects first before update state
      if (!Host.__isUpdating) {
        flushEffect();
      }

      const hook = hooks[hookID];
      // Reducer will update in the next render, before that we add all
      // actions to the queue
      const queue = hook[2];

      if (getCurrentInstance() === currentInstance) {
        queue.__actions.push(action);
        currentInstance.__isScheduled = true;
      } else {
        const currentState = queue.__eagerState;
        const eagerReducer = queue.__eagerReducer;
        const eagerState = eagerReducer(currentState, action);
        if (is(eagerState, currentState)) {
          return;
        }
        queue.__eagerState = eagerState;
        queue.__actions.push(action);
        currentInstance.__update();
      }
    };

    return hooks[hookID] = [
      initialState,
      dispatch,
      {
        __actions: [],
        __eagerReducer: reducer,
        __eagerState: initialState
      }
    ];
  }

  const queue = hook[2];
  let next = hook[0];

  if (currentInstance.__reRenders > 0) {
    for (let i = 0; i < queue.__actions.length; i++) {
      next = reducer(next, queue.__actions[i]);
    }
  } else {
    next = queue.__eagerState;
  }

  if (!is(next, hook[0])) {
    hook[0] = next;
    currentInstance.__shouldUpdate = true;
  }

  queue.__eagerReducer = reducer;
  queue.__eagerState = next;
  queue.__actions.length = 0;

  return hooks[hookID];
}
