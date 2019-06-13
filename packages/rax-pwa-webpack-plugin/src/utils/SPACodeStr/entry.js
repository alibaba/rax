module.exports = function getEntryCodeStr(options) {

  const { pathConfig } = options;

  return `
    import * as DriverDOM from 'driver-dom';
    import { createElement, render } from 'rax';

    import Router from '${pathConfig.appSrc}/_router';
    import Shell from '${pathConfig.appSrc}/shell/index';
    
    const pageComponent = (props) => {
      return <div id="root-page" ><Router {...props} /></div>;
    };
    
    if (document.getElementById('root-page')) {
      document.getElementById('root-page').innerHTML = '';
    }
    
    render(<Shell Component={pageComponent} />, document.getElementById('root'), { driver: DriverDOM, hydrate: true });
  `;
}