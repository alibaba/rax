let DebugID = 1;

// export Operation = {instanceID: DebugID} & (
//   {type: 'mount', payload: string} |
//   {type: 'insert child', payload: {toIndex: number, content: string}} |
//   {type: 'move child', payload: {fromIndex: number, toIndex: number}} |
//   {type: 'replace children', payload: string} |
//   {type: 'replace text', payload: string} |
//   {type: 'replace with', payload: string} |
//   {type: 'update styles', payload: mixed /* Style Object */} |
//   {type: 'update attribute', payload: {[name: string]: string}} |
//   {type: 'remove attribute', payload: string}
// );

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
