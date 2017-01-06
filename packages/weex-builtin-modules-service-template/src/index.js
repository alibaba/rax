// import foo from 'foo/dist/foo.factory';

const builtinModulesService = {

  create: (id, env, config) => {
    // Modules should wrap as module factory format, see: rax-webpack-plugin
    const builtinModules = {
      // `rax` have been build in framework, do not need add here
      // foo
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
