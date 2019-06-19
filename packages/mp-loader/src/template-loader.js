const { stringifyRequest, getOptions } = require('loader-utils');
const { relative } = require('path');
const { existsSync } = require('fs');
const { createRequire, renderHelperVars, prerveredVars } = require('./utils');
const transpiler = require('./transpiler');
const runtimeHelpers = require('./runtimeHelpers');
const { withScope } = require('sfc-compiler');

const ComponentLoaderPath = require.resolve('./component-loader');
const getPluginLoaderPath = require.resolve('./get-plugin-loader');
const PLUGIN_REG = /^plugin:\/\//;
const NODE_MODULES_REG = /^node_modules\//;

module.exports = function templateLoader(content) {
  const { resourcePath } = this;
  const options = getOptions(this) || {};
  const isEntryTemplate = options && options.isEntryTemplate;
  const dependencyComponents = options && options.dependencyComponents && JSON.parse(options.dependencyComponents);

  content = `<template>${content}</template>`; // Wrap <tempalte> when user define more then one nodes at root

  const { ast, renderFn, dependencies, tplAlias } = transpiler(content, {
    templatePath: resourcePath,
    type: options && options.type || 'ali'
  });

  let render = renderFn;
  const requireCssList = [];
  const { cssPath, appCssPath, componentBasePath } = options;
  if (existsSync(appCssPath)) {
    requireCssList.push(createRequire(stringifyRequest(this, appCssPath)));
    // Adds css file as dependency of the loader result in order to make them watchable.
    this.addDependency(appCssPath);
  }
  if (existsSync(cssPath)) {
    requireCssList.push(createRequire(stringifyRequest(this, cssPath)));
    this.addDependency(cssPath);
  }

  // Make css-loader processed object to string.
  const css = requireCssList.map((str) => str + '.toString()').join(' + ');
  const style = css ? `_c('style', null, ${css})` : null;
  if (isEntryTemplate) {
    /**
     * NOTE: Should config css-loader and postcss-loader in webpack.config.js
     * Wrap page for "page" css selector.
     * Mark data-userview-root for site build usage.
     */
    render = `_c('page', { 'data-userview-root': 'true' }, ${style}, ${renderFn})`;
  } else {
    // Prepend style tag to template
    render = style ? `[${style}, ${renderFn}]` : renderFn;
  }

  let registerPageComponent = '';
  if (dependencyComponents) {
    for (let componentName in dependencyComponents) {
      const isSelf = dependencyComponents[componentName] === '__SELF__';
      const depPath = dependencyComponents[componentName];

      if (PLUGIN_REG.test(depPath)) {
        const pluginComponentPath = depPath.replace(PLUGIN_REG, '');
        registerPageComponent += `__components_ref__['${componentName}'] = `
          + createRequire(stringifyRequest(this, `${getPluginLoaderPath}?type=component&path=${encodeURIComponent(pluginComponentPath)}!${resourcePath}`))
          + '(__render__);';
      } else {
        const loadComponent = createRequire(stringifyRequest(this, `${ComponentLoaderPath}!${dependencyComponents[componentName]}`));
        const loadComponentsHub = 'require(' + stringifyRequest(this, runtimeHelpers.componentsHub) + ')';
        if (isSelf) {
          /**
           * Delay getting component,
           * ensure component is registered.
           */
          let componentPath = relative(this.rootContext, componentBasePath);
          if (NODE_MODULES_REG.test(componentPath)) {
            componentPath = componentPath.replace(NODE_MODULES_REG, '');
          } else {
            componentPath = '/' + componentPath;
          }
          registerPageComponent += `
            Object.defineProperty(__components_ref__, '${componentName}', {
              get: function() {
                return (${loadComponentsHub}).getComponent('${componentPath}');
              }
            });
          `;
        } else {
          registerPageComponent += `__components_ref__['${componentName}'] = ${loadComponent}(__render__);`;
        }
      }
    }
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
    ${registerPageComponent}
  
    ${dependencies.map((subTemplate) => {
    if (!existsSync(subTemplate)) {
      return '';
    }
    const subTemplatePath = stringifyRequest(this, `${__filename}!${subTemplate}`);
    return `require(${subTemplatePath})(__render__, __templates_ref__);`;
  }).join(';\n')}
  
    function render(data) {
      ${renderFnScopeVariables}
      return ${render};
    }
  
    return ${tplAlias ? subTemplateRender : 'render'};
  }
  
  ${webviewHelpers}
  `;

  return source;
};

