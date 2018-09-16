const { stringifyRequest, getOptions } = require('loader-utils');
const { existsSync } = require('fs');
const { relative } = require('path');
const { createRequire, createRequireDefault, QueryString, vdomHelperVars, prerveredVars } = require('./shared/utils');
const { withScope } = require('sfc-compiler');
const transpiler = require('./transpiler');
const paths = require('./paths');

const STYLE_FILE_EXT = '.acss';
const TEMPLATE_FILE_EXT = '.axml';
const JS_FILE_EXT = '.js';

const stylesheetLoaderPath = require.resolve('stylesheet-loader');
/**
 * template loader
 */
module.exports = function templateLoader(content) {
  const {
    type,
    stylePath,
    globalStylePath,
    jsPath,
    isPage
  } = getOptions(this);
  const { resourcePath } = this;
  const relativePath = relative(this.rootContext, this.resourcePath);

  /**
   * 使用 view 包裹最外层组件
   * 页面 class: '@page'
   */
  const rawTpl = isPage
    ? `<view data-userview-root class="@page">${content}</view>`
    : `<template>${content}</template>`;

  const transpileOpts = {
    type,
    templatePath: resourcePath,
    scope: ''
  };
  const { renderFn, tplAlias, tplASTs, dependencies } = transpiler(rawTpl, transpileOpts);

  let tplRegisters = '';
  // tpl include and import
  if (Array.isArray(dependencies)) {
    for (let i = 0; i < dependencies.length; i++) {
      const tplPath = dependencies[i];
      let hasStyle = false;
      let hasJS = false;

      if (!existsSync(tplPath)) {
        continue;
      }

      const stylePath = tplPath.slice(0, -STYLE_FILE_EXT.length) + STYLE_FILE_EXT;
      if (existsSync(stylePath)) {
        hasStyle = true;
      }

      const jsPath = tplPath.slice(0, -JS_FILE_EXT.length) + JS_FILE_EXT;
      if (existsSync(jsPath)) {
        hasJS = true;
      }

      const qs = new QueryString({
        type,
        stylePath: hasStyle ? stylePath : null,
        jsPath: hasJS ? jsPath : null,
      });

      const componentReq = stringifyRequest(this, `!!${__filename}?${qs}!${tplPath}`);
      tplRegisters += `require(${componentReq})(__tpls__, Rax);`;
    }
  }

  // prepare requirements
  const vdomHelperReq = createRequireDefault(stringifyRequest(this, paths.vdomHelper));
  const styleReq = stylePath && stylePath !== 'undefined'
    ? createRequire(stringifyRequest(this, `${stylesheetLoaderPath}?disableLog=true!${stylePath}`))
    : '{}';
  const globalStyleReq = globalStylePath
    ? createRequire(stringifyRequest(this, `${stylesheetLoaderPath}?disableLog=true!${globalStylePath}`))
    : '{}';

  const renderFnScopeVariables = withScope(
    renderFn,
    prerveredVars,
    'data'
  );

  return `;(function(globalStyle, pageStyle, __vdom_helpers__){
    ${vdomHelperVars}
    module.exports = function renderFactory(__parent_tpls__, Rax) {
      var __tpls__ = {};
      var __sfc_components_ref__ = {};
      var __styles__ = Object.assign({}, globalStyle, pageStyle, ${styleReq});
      function _w(is) { return __tpls__[is] ? __tpls__[is] : null; }
      ${''}
      _c = _c.bind(Rax);
      ${''} 
      ${tplRegisters}
      function render(data) {
        ${renderFnScopeVariables}
        return ${renderFn};
      }
      return __parent_tpls__ ? (__parent_tpls__['${tplAlias}'] = render) : render;
    }
  })(
    ${globalStyleReq},
    ${styleReq},
    ${vdomHelperReq}
  );`;
};
