const { stringifyRequest, getOptions } = require('loader-utils');
const { existsSync } = require('fs');
const { relative } = require('path');
const { makeMap, compileES5, QueryString } = require('../shared/utils');
const transpile = require('../transpiler');
const paths = require('../paths');

const injectThisScope = require(paths.injectThisScope);

const stylesheetLoaderPath = require.resolve('stylesheet-loader');
const helperFns = '_c,_o,_n,_s,_l,_t,_q,_i,_m,_f,_k,_b,_v,_e,_u,_g,_cx';

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

  // provide scope vars
  // provide render helper vars
  const helperVariables = helperFns
    .split(',')
    .map(alias => `var ${alias} = __v.${alias};`)
    .join('');

  // prepare requirements
  const styleReq = stylePath && stylePath !== 'undefined'
    ? 'require('
    + stringifyRequest(this, `${stylesheetLoaderPath}!${stylePath}`)
    + ')'
    : '{}';
  const sfcRuntimeReq = stringifyRequest(this, paths.sfcRuntime);
  const globalStyleReq = globalStyle && globalStyle !== 'undefined'
    ? `require(${stringifyRequest(
      this,
      stylesheetLoaderPath + '!' + globalStyle
    )})`
    : '{}';

  const scopeVariables = injectThisScope(
    renderFn,
    makeMap(helperFns + ',_w,data,true,false,null,$event'),
    'data'
  );

  return `;(function(globalStyle, pageStyle, __v, getApp, my){
    ${helperVariables}

    module.exports = function($parentTpls) {
      _c = _c.bind(this);

      var $tpls = {};
      function _w(is) {
        return $tpls[is] ? $tpls[is] : null;
      }
      ${tplRegisters}

      function render(data) {
        ${scopeVariables}
        var _st = Object.assign({}, globalStyle, pageStyle, ${styleReq});
        return ${renderFn};
      }

      return $parentTpls ? ($parentTpls['${tplAlias}'] = render) : render;
    }
  })(
    ${globalStyleReq},
    ${styleReq},
    require(${sfcRuntimeReq}).vdomHelper,
    require(${stringifyRequest(this, paths.getApp)}).default,
    require(${stringifyRequest(this, paths.createAPI)})({ currentPath: ${JSON.stringify(relativePath)} })
  );`;
};
