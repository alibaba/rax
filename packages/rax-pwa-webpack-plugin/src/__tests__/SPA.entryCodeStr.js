const getEntryCodeStr = require('../res/getEntryCodeStr');

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
      import { createRouter } from 'rax-pwa';
      import Shell from 'TestAppShell';

      const pagesConfig = {
      
        index: {
          path: '/index', 
          regexp: /^\/index(?:\/)?$/i,
          pageAlive: false,
          component: () => import(/* webpackChunkName: "index" */ 'TestAppSrc/pages/index/index'),
          title: "index",
        },
      
      };

      const Router = createRouter(pagesConfig, false);
      const PageComponent = (props) => {
        return <div id="root-page" ><Router {...props}/></div>;
      };
      
      if (document.getElementById('root-page')) {
        document.getElementById('root-page').innerHTML = '';
      }
      
      let initialProps;
      try {
        initialProps = JSON.parse(document.querySelector("[data-from='server']").innerHTML);
      } catch (e) {
        initialProps = {};
      }

      render(<Shell Component={PageComponent} {...initialProps} />, document.getElementById("root"), { driver: DriverDOM, hydrate: true });
    `);

    expect(filterCodeStr(getEntryCodeStr({ appConfig, pathConfig, pagesConfig, withSSR, withAppShell }))).toBe(expectResult);
  });
});

