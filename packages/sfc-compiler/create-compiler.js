const { extend } = require('./utils');
const { detectErrors } = require('./error-detector');
const { createCompileToFunctionFn } = require('./to-function');

exports.createCompilerCreator = function createCompilerCreator(baseCompile) {
  return function createCompiler(baseOptions) {
    function compile(template, options) {
      const finalOptions = Object.create(baseOptions);
      const errors = [];
      const tips = [];
      finalOptions.warn = (msg, tip) => {
        (tip ? tips : errors).push(msg);
      };

      if (options) {
        // merge custom modules
        if (options.modules) {
          finalOptions.modules = (baseOptions.modules || []).concat(
            options.modules
          );
        }
        // merge custom directives
        if (options.directives) {
          finalOptions.directives = extend(
            Object.create(baseOptions.directives),
            options.directives
          );
        }
        // copy other options
        for (const key in options) {
          if (key !== 'modules' && key !== 'directives') {
            finalOptions[key] = options[key];
          }
        }
      }

      const compiled = baseCompile(template, finalOptions);
      if (process.env.NODE_ENV !== 'production') {
        errors.push.apply(errors, detectErrors(compiled.ast));
      }
      compiled.errors = errors;
      compiled.tips = tips;
      return compiled;
    }

    return {
      compile,
      compileToFunctions: createCompileToFunctionFn(compile)
    };
  };
};
