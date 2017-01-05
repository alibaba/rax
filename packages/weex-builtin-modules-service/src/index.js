// import rax from 'rax/dist/rax.factory';

const builtinModulesService = {

  create: (id, env, config) => {
    // Modules should wrap as module factory format, see: rax-webpack-plugin
    const builtinModules = {
      // rax
    };

    return {
      instance: {
        builtinModules
      }
    };
  },

  destroy: (id, env) => {
  }
};

export default builtinModulesService;
