module.exports = function(modules) {
  function define(name, deps, factory) {
    if (deps instanceof Function) {
      factory = deps;
      deps = [];
    }

    modules[name] = {
      factory: factory,
      deps: deps,
      module: {exports: {}},
      isInitialized: false,
      hasError: false,
    };
  }

  return define;
};
