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
        if (${functionName}.getInitialProps) {
          ${functionName}.getInitialProps().then((props = {}) => {
            hydrate(createElement(${functionName}, props), document.getElementById('root'));
          });
        } else {
          hydrate(createElement(${functionName}), document.getElementById('root'));
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
      console.log(1);
    `;
  }

  return code;
};