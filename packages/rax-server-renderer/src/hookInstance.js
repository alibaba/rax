class HookInstance {
  constructor() {
    this._hookID = 0;
    this._hooks = {};
  }

  getHookID() {
    return ++ this._hookID;
  }

  getHooks() {
    return this._hooks;
  }
}

export default HookInstance;