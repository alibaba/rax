let DebugID = 1;

let HostOperationHistoryHook = null;

let history = [];

HostOperationHistoryHook = {
  onHostOperation(operation) {
    history.push(operation);
  },

  clearHistory() {
    if (HostOperationHistoryHook._preventClearing) {
      return;
    }

    history = [];
  },

  getHistory() {
    return history;
  },
};

export default HostOperationHistoryHook;
