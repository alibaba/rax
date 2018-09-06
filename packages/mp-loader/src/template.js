const { stringifyRequest, getOptions } = require('loader-utils');
const { existsSync } = require('fs');
const { relative } = require('path');
const { makeMap, compileToES5, createRequire, createRequireDefault, QueryString, vdomHelperVars, prerveredVars } = require('./shared/utils');
const { withScope } = require('sfc-compiler');
const transpile = require('./transpiler');
const paths = require('./paths');

const stylesheetLoaderPath = require.resolve('stylesheet-loader');
/**
 * template loader
 */
module.exports = function templateLoader(content) {
  const {
    type,
    stylePath,
    globalStyle,
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
  const { renderFn, tplAlias, tplASTs, dependencies } = transpile(rawTpl, transpileOpts);

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

      const stylePath = tplPath.slice(0, -5) + '.acss';
      if (existsSync(stylePath)) {
        hasStyle = true;
      }

      const jsPath = tplPath.slice(0, -5) + '.js';
      if (existsSync(jsPath)) {
        hasJS = true;
      }

      const qs = new QueryString({
        type,
        stylePath: hasStyle ? stylePath : null,
        jsPath: hasJS ? jsPath : null,
      });

      const componentReq = stringifyRequest(this, `!!${__filename}?${qs}!${tplPath}`);
      tplRegisters += `require(${componentReq}).call(this,$tpls);`;
    }
  }

  // prepare requirements
  const styleReq = stylePath && stylePath !== 'undefined'
    ? createRequire(stringifyRequest(this, `${stylesheetLoaderPath}!${stylePath}`))
    : '{}';
  const vdomHelperReq = stringifyRequest(this, paths.vdomHelper);
  const globalStyleReq = globalStyle
    ? createRequire(stringifyRequest(
      this,
      stylesheetLoaderPath + '?disableLog=true!' + globalStyle
    ))
    : '{}';

  const renderFnScopeVariables = withScope(
    renderFn,
    prerveredVars,
    'data'
  );

  return `;(function(globalStyle, pageStyle, __vdom_helpers__, getApp){
    ${vdomHelperVars}
    module.exports = function($parentTpls) {
      _c = _c.bind(this);

      var $tpls = {};
      var __styles__ = Object.assign({}, globalStyle, pageStyle, ${styleReq});
      function _w(is) {
        return $tpls[is] ? $tpls[is] : null;
      }
      ${tplRegisters}

      function createVDOM(data) {
        var __components_refs__ = this.__components_refs__;
        ${renderFnScopeVariables}
        return ${renderFn};
      }

      return $parentTpls ? ($parentTpls['${tplAlias}'] = createVDOM) : createVDOM;
    }
  })(
    ${globalStyleReq},
    ${styleReq},
    ${createRequireDefault(vdomHelperReq)},
    ${createRequireDefault(stringifyRequest(this, paths.getApp))}
  );`;
};
