const { stringifyRequest, getOptions } = require('loader-utils');
const { relative } = require('path');
const parseSFCParts = require('./sfc/parser');
const transformScript = require('./transform/script');
const { createCompiler, createRenderFn, baseOptions } = require('sfc-compiler');
const modules = require('./modules');

const sfcLoader = require.resolve('.');
const sfcStyleLoader = require.resolve('./sfcStyleLoader');
const stylesheetLoader = require.resolve('stylesheet-loader');
const compiler = createCompiler(Object.assign({}, baseOptions, { modules }));
const builtInRaxModuleName = JSON.stringify('@core/rax');
const builtInRuntimeModuleName = JSON.stringify('@core/runtime');
const runtimeModuleName = JSON.stringify(require.resolve('./helpers/runtime'));
const raxModuleName = JSON.stringify('rax');

module.exports = function(rawContent) {
  const context = this;
  const callback = this.async();
  const contextPath = this.rootContext || this.options && this.options.context || process.cwd();
  const filePath = this.resourcePath;
  const userOptions = getOptions(this) || {};
  const relativePath = relative(contextPath, filePath);

  const { template, script, styles } = parseSFCParts(rawContent);

  /**
   * If `part` passed, return SFC's pointed part.
   */
  if (userOptions.part === 'style') {
    return callback(null, styles ? styles.content : '');
  }

  const declarationName = '__sfc_module_declaration__';
  const { declarationCode, sourceMap, scopeIdentifiers } = transformScript(
    script.content,
    declarationName,
    relativePath,
    rawContent
  );

  const { render, ast } = compiler.compile(template.content, {
    scopeRefIdentifiers: scopeIdentifiers,
    /**
     * Rax prefer false to make it more similar to JSX,
     * default to false.
     */
    preserveWhitespace: !!userOptions.preserveWhitespace,
    cssInJS: userOptions && userOptions.cssInJS,
  });

  if (!ast) {
    console.warn(
      `Template is empty or not valid, please check ${relative(
        contextPath,
        filePath
      )}!`
    );
  }

  const renderFn = ast
    ? createRenderFn(render, {
      loaderContext: context,
      tagHelperMap: ast.tagHelperMap,
      weexGlobalComponents: userOptions.weexGlobalComponents || null,
      stringifyRequest
    })
    : 'function() { return function() { return ""; } }';

  /**
   * By default, sfc loader will create style tag for CSS text.
   * if RN/Weex style CSS is needed, enable `cssInJS` in loader option.
   */
  let loadStyleRequest;
  if (userOptions.cssInJS === true) {
    const styleLoader = `${stylesheetLoader}?disableLog=true&transformDescendantCombinator=true`;
    // prefix -! means stop any pitching loaders
    loadStyleRequest = stringifyRequest(
      context,
      `-!${styleLoader}!${sfcLoader}?part=style!${filePath}`
    );
  } else {
    loadStyleRequest = stringifyRequest(
      context,
      `${sfcStyleLoader}!${filePath}?style`
    );
  }

  const sfcRuntimeModuleName = userOptions.builtInRuntime ? builtInRuntimeModuleName : runtimeModuleName;

  /**
   * support ESModules / commonjs exportation
   */
  const moduleExportsWrapper = [];

  if (userOptions.module === 'commonjs') {
    // commonjs
    moduleExportsWrapper[0] = 'module.exports =';
    moduleExportsWrapper[1] = '';
  } else {
    // ESModules
    moduleExportsWrapper[0] = 'exports.__esModule = true; exports.default =';
    moduleExportsWrapper[1] = '.default';
  }

  const output = `${declarationCode};
    ${moduleExportsWrapper[0]} require(${sfcRuntimeModuleName})${moduleExportsWrapper[1]}(
      typeof ${declarationName} === 'undefined' ? {} : ${declarationName},
      ${renderFn},
      require(${loadStyleRequest}),
      require(${userOptions.builtInRax ? builtInRaxModuleName : raxModuleName})
    );`;

  // whether webpack's devtool is configured
  if (this.sourceMap) {
    callback(null, output, sourceMap);
  } else {
    callback(null, output);
  }
};
