const getSPAEntryCodeStr = require('../getSPAEntryCodeStr');

const appConfig = {
  spa: true
};

const pathConfig = {
  appDirectory: 'TestAppDirectory',
  appIndexJs: 'TestAppIndexJs',
  appSrc: 'TestAppSrc',
  appDocument: 'TestAppDocument',
  appShell: 'TestAppShell'
};

const pagesConfig = {
  index: {
    path: '/index',
    title: 'index',
    _regexp: '/^/index(?:/)?$/i',
    _filePath: 'testPagesIndex'
  }
};

// https://stackoverflow.com/questions/51605469/jest-how-to-compare-two-strings-with-different-format
const filterCodeStr = (codeStr) => {
  return codeStr.replace(/\s/g, '');
};

describe('SPA entry file code string test', () => {
  it('should have a shell component with App Shell', function() {
    const withSSR = false;
    const withAppShell = true;

    const expectResult = filterCodeStr(`
      import * as DriverDOM from 'driver-dom';
      import { createElement, render, useState } from 'rax';
      import { createRouter, getCurrentComponent  } from 'rax-pwa';
      import Shell from 'TestAppShell';

      let initialProps;
      const pagesConfig = {
      
        index: {
          path: '/index', 
          regexp: /^\/index(?:\/)?$/i,
          pageAlive: false,
          component: function() {return import(/* webpackChunkName: "index" */ 'TestAppSrc/pages/index/index')},
          title: "index",
        },
      
      };
      const app = function() {
        // Clear skeleton
        if (document.getElementById('root-page')) {
          document.getElementById('root-page').innerHTML = '';
        }
        
        
        try {
          initialProps = JSON.parse(document.querySelector("[data-from='server']").innerHTML);
        } catch (e) {
          initialProps = {};
        }

        // In Code Splitting mode, the <Router /> is not rendering the routing content for the first time, result in unsuccessful hydrate components. 
        // Match the first component for hydrate
        getCurrentComponent(pagesConfig, false)().then(function(InitialComponent) {
          if (InitialComponent === null) {
            document.getElementById('root').innerHTML = '';
            renderApp(InitialComponent);
          } else {
            InitialComponent = InitialComponent.__esModule ? InitialComponent.default : InitialComponent;
            if(!false && InitialComponent.getInitialProps) {
              InitialComponent.getInitialProps().then(function(props) {
                renderApp(InitialComponent, props);
              }).catch(function(e){
                renderApp(InitialComponent);  
              });
            } else {
              renderApp(InitialComponent);
            }
          }
        });
      };

      const renderApp = function(InitialComponent, initialComponentProps) {
        const Router = createRouter(pagesConfig, false, InitialComponent, initialComponentProps);
        const PageComponent = function(props) {
          return <div id="root-page" ><Router {...props}/></div>;      
        };
        render(<Shell Component={PageComponent} {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });
      };

      false?window.addEventListener("load", app):app();
      
    `);

    expect(filterCodeStr(getSPAEntryCodeStr({ appConfig, pathConfig, pagesConfig, withSSR, withAppShell }))).toBe(expectResult);
  });
});

