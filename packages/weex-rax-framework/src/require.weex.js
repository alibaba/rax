module.exports = function(modules, appRequire, appModules) {
  function require(name) {
    var mod = modules[name];
    let req = require;

    if (mod && mod.isInitialized) {
      return mod.module.exports;
    }

    if (!mod) {
        //if(appModules) {
            if(appRequire && appModules[name] ) {
                mod = appModules[name];
                req =  appRequire;
                if (mod.isInitialized) {
                  return mod.module.exports;
                }
            }
            else {
                throw new Error(
                  'Requiring unknown module "' + name + '"'
                );
            }
        //}
    }

    if (mod.hasError) {
      throw new Error(
        'Requiring module "' + name + '" which threw an exception'
      );
    }

    try {
      mod.isInitialized = true;
      mod.factory(req, mod.module.exports, mod.module);
    } catch (e) {
      mod.hasError = true;
      mod.isInitialized = false;
      throw e;
    }

    return mod.module.exports;
  }

  return require;
};
