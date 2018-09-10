const { stringifyRequest, getOptions } = require('loader-utils');
const { relative } = require('path');
const parseSFCParts = require('./sfc/parser');
const transformScript = require('./transform/script');
const transformStyle = require('./transform/style');
const { createCompiler, createRenderFn, baseOptions } = require('sfc-compiler');

const transformLoader = require.resolve('./transform/loader');
const stylesheetLoader = require.resolve('stylesheet-loader');
const compiler = createCompiler(baseOptions);

module.exports = function(rawContent) {
  this.cacheable();

  const callback = this.async();
  const context = this;
  const contextPath = this.rootContext || this.options && this.options.context || process.cwd();
  const filePath = this.resourcePath;
  const userOptions = getOptions(this) || {};
  const relativePath = relative(contextPath, filePath);

  const { template, script, styles } = parseSFCParts(rawContent);
  const declarationName = '__sfc_module_declaration__';
  const { declarationCode, sourceMap, scopeIdentifiers } = transformScript(
    script.content,
    declarationName,
    relativePath,
    rawContent
  );

  const { render, ast } = compiler.compile(template.content, {
    scopeRefIdentifiers: scopeIdentifiers,
    // rax prefer false to make it more similar to JSX
    // undefined means true
    preserveWhitespace: userOptions.preserveWhitespace
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

  transformStyle(styles.content, filePath);

  const loadStyleString = `${stylesheetLoader}?disableLog=true&transformDescendantCombinator=true!${transformLoader}?id=${filePath}`;
  const loadStyleRequest = stringifyRequest(
    context,
    `!!${loadStyleString}!${filePath}`
  );

  let sfcRuntimeModuleName;
  let raxModuleName;

  if (userOptions.builtInRuntime) {
    sfcRuntimeModuleName = JSON.stringify('@core/runtime');
    raxModuleName = JSON.stringify('@core/rax');
  } else {
    sfcRuntimeModuleName = JSON.stringify(require.resolve('./helpers/runtime'));
    raxModuleName = JSON.stringify('rax');
  }

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
      require(${raxModuleName})
    );`;

  // whether webpack's devtool is configured
  if (this.sourceMap) {
    callback(null, output, sourceMap);
  } else {
    callback(null, output);
  }
};
