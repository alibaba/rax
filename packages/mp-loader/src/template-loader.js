const { stringifyRequest, getOptions } = require('loader-utils');
const { existsSync, readFileSync } = require('fs');
const { relative } = require('path');
const { createRequire, renderHelperVars, prerveredVars } = require('./utils');
const transpiler = require('./transpiler');
const runtimeHelpers = require('./runtimeHelpers');
const { withScope } = require('sfc-compiler');

module.exports = function templateLoader(content) {
  const options = getOptions(this);
  const isEntryTemplate = options && options.isEntryTemplate;

  content = `<template>${content}</template>`; // Wrap <tempalte> when user define more then one nodes at root

  const {ast, renderFn, dependencies, tplAlias } = transpiler(content, {
    templatePath: this.resourcePath,
  });

  let entryRender = '';

  if (isEntryTemplate) {
    const {cssPath, appCssPath} = options;
    // NOTE: Should config css-loader and postcss-loader in webpack.config.js
    const requireAppCss = createRequire(stringifyRequest(this, appCssPath));
    const requireCss = createRequire(stringifyRequest(this, cssPath));

    let css = `${requireAppCss} + ${requireCss}`;

    // TODO: rpx in css should be convert in runtime
    let style = `_c('style', null, ${css})`;
    // Wrap page for "page" css selector
    entryRender = `_c('page', null, ${style}, ${renderFn})`;
  }

  const requireRenderHelpers = createRequire(stringifyRequest(this, runtimeHelpers.renderHelpers));
  const renderFnScopeVariables = withScope(renderFn, prerveredVars, 'data'); // => var state = data.state;

  const webviewHelpers = ast.isWebView ?
    `module.exports.getWebViewSource = function (data) { return ${ast.webViewSrc}; };
  module.exports.getWebViewOnMessage = function (data) { return ${ast.webViewOnMessage}; };` : '';

  const subTemplateRender = tplAlias ? `__parent_templates_ref__['${tplAlias}'] = render` : '';

  const source = `module.exports = function (__render__ ${tplAlias ? ', __parent_templates_ref__' : ''}) {
  // Register render first
  var __render_helpers__ = ${requireRenderHelpers};
  __render_helpers__._r(__render__);
  ${renderHelperVars};

  // Templates store
  var __templates_ref__ = {};
  function _w(is) { return __templates_ref__[is] ? __templates_ref__[is] : null; }
  
  // Custom components ref
  var __components_ref__ = {};

  ${dependencies.map((subTemplate) => {
    if (!existsSync(subTemplate)) {
      return '';
    }
    const subTemplatePath = stringifyRequest(this, `!!${__filename}!${subTemplate}`);
    return `require(${subTemplatePath})(__render__, __templates_ref__);`;
  }).join(';\n')}

  function render(data) {
    ${renderFnScopeVariables}
    return ${isEntryTemplate ? entryRender : renderFn}
  }

  return ${tplAlias ? subTemplateRender : 'render'};
}

${webviewHelpers}
`;

  return source;
};
