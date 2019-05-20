const qs = require('querystring');

module.exports = function(source) {
  const query = typeof this.query === 'string' ? qs.parse(this.query.substr(1)) : this.query;

  const {
    ssr,
  } = query;

  const functionName = '_PWA_page_component_';
  let code = source.replace('export default', `const ${functionName} =`);

  if (ssr === 'true') {
    code += `
      import hydrate from 'rax-hydrate';
      window.onload = function(){
        var data = null;
        try {
          data = JSON.parse(document.querySelector("[data-from='server']").innerHTML);
        } catch (e) {
          // ignore
        }
        if (data !== null || !${functionName}.getInitialProps) {
          hydrate(createElement(${functionName}, data || {}), document.getElementById('root'));
        } else {
          ${functionName}.getInitialProps().then((props = {}) => {
            hydrate(createElement(${functionName}, props), document.getElementById('root'));
          });
        }
      }
    `;
  } else {
    code += `
      import {render} from 'rax';
      import * as DriverDOM from 'driver-dom';
      if (${functionName}.getInitialProps) {
        ${functionName}.getInitialProps().then((props = {}) => {
          render(createElement(${functionName}, props), document.getElementById('root'), { driver: DriverDOM });
        });
      } else {
        render(createElement(${functionName}), document.getElementById('root'), { driver: DriverDOM });
      }
    `;
  }

  return code;
};