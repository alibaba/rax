import Windmill from '@ali/windmill-renderer/dist/windmill.renderer';
const MODULE_NAME_PREFIX = '@weex-module/';

module.exports = function(modules, weex) {
  function require(name) {
    var mod = modules[name];
    var windmill = Windmill(weex);

    // if retuire '@weex-module/'
    if (name.split(MODULE_NAME_PREFIX).length > 1) {
      const weexModuleName = name.split(MODULE_NAME_PREFIX)[1];
      if (weex.isRegisteredModule(weexModuleName)) {
        if (weex.environment == 'APP') {
          return windmill.$call(weexModuleName);
        } else {
          return weex.requireModule(weexModuleName);
        }
      } else {
        throw new Error(
          'Requiring unknown weex module "' + name + '"'
        );
      }
    }

    if (mod && mod.isInitialized) {
      return mod.module.exports;
    }

    if (!mod) {
      throw new Error(
        'Requiring unknown module "' + name + '"'
      );
    }

    if (mod.hasError) {
      throw new Error(
        'Requiring module "' + name + '" which threw an exception'
      );
    }

    try {
      mod.isInitialized = true;
      mod.factory(require, mod.module.exports, mod.module);
    } catch (e) {
      mod.hasError = true;
      mod.isInitialized = false;
      throw e;
    }

    return mod.module.exports;
  }

  return require;
};
