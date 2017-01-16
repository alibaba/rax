const builtinGlobalsService = {

  create: (id, env, config) => {
    const builtinGlobals = {
      // jQuery: 'jquery'
    };

    return {
      instance: {
        builtinGlobals
      }
    };
  },

  destroy: (id, env) => {
  }
};

global.registerService('builtinGlobalsService', builtinGlobalsService);
