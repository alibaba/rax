const { getOptions } = require('loader-utils');
const babel = require('@babel/core');
const { getBabelConfig } = require('rax-compile-config');

const babelConfig = getBabelConfig();

module.exports = function(content) {
  const options = getOptions(this) || {};
  const renderModule = options.renderModule || 'rax';

  let appRender = '';

  if (options.type === 'weex') {
    appRender = 'render(createElement(Entry), null, { driver: DriverUniversal });';
  } else {
    appRender = 'render(createElement(Entry), document.getElementById("root"), { driver: DriverUniversal });';
  }

  const source = `
    import { render, createElement } from '${renderModule}';
    import Component from '${this.resourcePath}';
    import DriverUniversal from 'driver-universal';

    function Entry() {
      return createElement(Component);
    }

    ${appRender}
  `;

  const { code } = babel.transformSync(source, babelConfig);

  return code;
};
