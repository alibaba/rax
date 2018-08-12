const { stringifyRequest, getOptions } = require('loader-utils');
const { basename, extname, dirname, relative, join } = require('path');
const parseSFCParts = require('./sfc/parser');
const transformScript = require('./transform/script');
const transformStyle = require('./transform/style');
const { uniqueInstanceID, warn } = require('sfc-compiler/utils');
const createRenderFn = require('sfc-compiler/codegen/createRenderFn');
const { baseOptions } = require('sfc-compiler/options');
const { createCompiler } = require('sfc-compiler');

const transformLoader = require.resolve('./transform/loader');
let adapterRaxEntry = require.resolve('./helpers');
const stylesheetLoader = require.resolve('stylesheet-loader');
const compiler = createCompiler(baseOptions);

module.exports = function (rawContent, inputSourceMap) {
  this.cacheable();

  const callback = this.async();
  const context = this;
  const contextPath =
    this.rootContext || this.options && this.options.context || process.cwd();
  const filePath = this.resourcePath;
  const userOptions = getOptions(this) || {};
  const relativePath = relative(contextPath, filePath);

  const { template, script, styles } = parseSFCParts(rawContent);
  const declarationName = `$_${uniqueInstanceID}_declaration`;
  const { declarationCode, sourceMap, scopeIdentifiers } = transformScript(
    script.content,
    declarationName,
    relativePath,
    rawContent
  );

  if (!template.content) {
    template.content = '';
  }

  const { render, ast } = compiler.compile(template.content, {
    scopeRefIdentifiers: scopeIdentifiers,
    // rax prefer false to make it more similar to JSX
    // undefined means true
    preserveWhitespace: userOptions.preserveWhitespace
  });

  if (!ast) {
    warn(
      `template is empty or not valid, please check ${relative(
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

  const loadStyleString = `${stylesheetLoader}?transformDescendantCombinator=true!${transformLoader}?id=${filePath}`;
  const loadStyleRequest = loaderUtils.stringifyRequest(
    context,
    `!!${loadStyleString}!${filePath}`
  );

  let loadRaxRqeuset = JSON.stringify('rax');

  if (userOptions.builtInRuntime) {
    adapterRaxEntry = userOptions.runtimeModule || '@core/runtime';
    loadRaxRqeuset = JSON.stringify('@core/rax');
  }

  /**
   * support ESModules / commonjs exportation
   * ?module=modules/commonjs
   */
  const moduleExports = ['exports.__esModule=true;exports.default=', '.default'];

  if (userOptions.module === 'commonjs') {
    moduleExports[0] = 'module.exports =';
    moduleExports[1] = '';
  }

  const output = `${declarationCode};
    ${moduleExports[0]} require('${adapterRaxEntry}')${moduleExports[1]}(
      typeof ${declarationName}===void 0?{}:${declarationName},
      ${renderFn},
      require(${loadStyleRequest}),
      require(${loadRaxRqeuset})
    );`;

  // if webpack devtool is configured
  if (this.sourceMap) {
    callback(null, output, sourceMap);
  } else {
    callback(null, output);
  }
};
