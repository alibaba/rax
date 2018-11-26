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
  const states = currentInstance.hookStates;

  if (!currentInstance.isComponentRendered()) {
    states[hookId] = initialState;
  }

  const setState = newState => {
    if (newState !== states[hookId]) {
      states[hookId] = newState;
      currentInstance.forceUpdate();
    }
  };

  return [states[hookId], setState];
}

export function useContext(context) {
  const currentInstance = getCurrentRenderingInstance();
  return currentInstance.readContext(context);
}

export function useEffect(effect, inputs) {
  const currentInstance = getCurrentRenderingInstance();
  const hookId = currentInstance.getCurrentHookId();

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

    currentInstance.hookEffects[hookId] = {
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
        const { prevInputs, inputs } = currentInstance.hookEffects[hookId];
        if (inputs.some((data, index) => data !== prevInputs[index])) {
          create();
        }
      });
    }
  } else {
    const record = currentInstance.hookEffects[hookId];
    const { create, destory, inputs: prevInputs = [] } = record;
    record.inputs = inputs;
    record.prevInputs = prevInputs;

    if (!inputs || inputs.some((data, index) => data !== prevInputs[index])) {
      destory();
      create.current = effect;
    }
  }
}
