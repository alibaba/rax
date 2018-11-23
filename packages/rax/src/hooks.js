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
  const hookId = ++currentInstance.hooksIndex;
  const state = currentInstance.state;

  if (!state.hasOwnProperty(hookId)) {
    state[hookId] = initialState;
  }

  const setState = newState => {
    if (newState !== state[hookId]) {
      state[hookId] = newState;
      currentInstance.forceUpdate();
    }
  };

  return [state[hookId], setState];
}

export function useContext(context) {
  const currentInstance = getCurrentRenderingInstance();
  return currentInstance.readContext(context);
}
