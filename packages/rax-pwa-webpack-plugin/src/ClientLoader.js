const qs = require('querystring');

module.exports = function(source) {
  const query = typeof this.query === 'string' ? qs.parse(this.query.substr(1)) : this.query;

  const {
    ssr,
    withAppShell,
  } = query;
  let code = source;

  if (ssr === 'true') {
    const functionName = '_PWA_page_component_';
    const renderCodeStr = withAppShell === 'true' ?
      `render(createElement(AppShell, Object.assign(data || {}, { Component: function(props) {return createElement(${functionName}, props || {}); }})), document.getElementById('root'), { driver: DriverDOM, hydrate: true });` :
      `render(createElement(${functionName}, data || {}), document.getElementById('root'), { driver: DriverDOM, hydrate: true });`;
    code = source.replace('export default', `var ${functionName} =`);
    code += `
      import {render} from 'rax';
      import * as DriverDOM from 'driver-dom';
      ${withAppShell === 'true' ? "import AppShell from '../../shell/';" : ''}
      window.onload = function(){
        var data = null;
        try {
          data = JSON.parse(document.querySelector("[data-from='server']").innerHTML);
        } catch (e) {
          // ignore
        }
        if (data !== null || !${functionName}.getInitialProps) {
          ${renderCodeStr}
        } else {
          ${functionName}.getInitialProps().then(function(data) {
            ${renderCodeStr}
          });
        }
      }
    `;
  }

  return code;
};
