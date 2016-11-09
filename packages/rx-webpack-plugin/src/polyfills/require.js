(function(global) {
  if (typeof define !== 'undefined') {
    return;
  }

  /* eslint strict:0 */
  var modules = {};
  var inGuard = false;

  function def(id, deps, factory) {
    if (deps instanceof Function) {
      factory = deps;
      deps = [];
    }

    modules[id] = {
      factory: factory,
      deps: deps,
      module: {exports: {}},
      isInitialized: false,
      hasError: false,
    };
  }

  function req(id) {
    // Weex built-in modules
    if (id.indexOf('@weex-module') === 0) {
      return {};
    }

    var originId = id;
    var mod = modules[id];
    // Node like require
    if (!mod) {
      id = id + '/index';
      mod = modules[id];
    }

    if (mod && mod.isInitialized) {
      return mod.module.exports;
    }

    return requireImpl(id, originId);
  }

  function requireImpl(id, originId) {
    if (global.ErrorUtils && !inGuard) {
      inGuard = true;
      var returnValue;
      try {
        returnValue = requireImpl.apply(this, arguments);
      } catch (e) {
        global.ErrorUtils.reportFatalError(e);
      }
      inGuard = false;
      return returnValue;
    }

    var mod = modules[id];
    if (!mod) {
      throw new Error(
        'Requiring unknown module "' + originId + '"'
      );
    }

    if (mod.hasError) {
      throw new Error(
        'Requiring module "' + originId + '" which threw an exception'
      );
    }

    try {
      // We must optimistically mark mod as initialized before running the factory to keep any
      // require cycles inside the factory from causing an infinite require loop.
      mod.isInitialized = true;

      // keep args in sync with with defineModuleCode in
      // rx/bundler/src/resolver.js
      mod.factory(req, mod.module.exports, mod.module);
    } catch (e) {
      mod.hasError = true;
      mod.isInitialized = false;
      throw e;
    }

    return mod.module.exports;
  }

  global.define = def;
  global.require = req;
  global.__d = def;
  global.__r = req;
})(this);
