import { createElement, useRef, useState, useImperativeHandle } from 'rax';
import * as RaxUseRouter from 'rax-use-router';
import { isWeex, isWeb, isNode } from 'universal-env';
import { createHashHistory } from 'history';
import encodeQS from 'querystring/encode';

let _history = null;
let _routerConfig = {};

// current process Page.getInitialProps path
let _currentPagePath;
// The initialProps
let _initialProps = {};
// The initialPropsProps from SSR
let _initialPropsFromSSR = null;
// Mark if the page is loaded for the first time.
// If it is the first time to load, SSR pageInitialProps is taken from the scripts.
// If the SPA has switched routes then each sub-component needs to run getInitialProps
let _isReadInitialPropsFromSSR = false;

try {
  if (window.__INITIAL_DATA__) {
    _initialPropsFromSSR = window.__INITIAL_DATA__.pageData;
  }
} catch (e) {
  // ignore SSR window is not defined
}


export function useRouter(routerConfig) {
  _routerConfig = routerConfig;

  if (isWeb) {
    const { history = createHashHistory(), routes } = routerConfig;
    _history = history;
  }

  function Router(props) {
    const [currentPath, setCurrentPath] = useState('');

    // return initial component in ssr
    if (isNode && routerConfig.InitialComponent) {
      return createElement(routerConfig.InitialComponent, props);
    }

    const { component } = RaxUseRouter.useRouter(() => _routerConfig);

    if (!component || Array.isArray(component) && component.length === 0) {
      // Return null directly if not matched.
      return null;
    } else {
      // process Page.getInitialProps
      if (_currentPagePath !== _history.location.pathname) {
        _initialProps = {};
        _currentPagePath = _history.location.pathname;
        // SSR project the first time is initialized from global data,
        // after that the data will be obtained from the component's own getInitialProps
        if (_initialPropsFromSSR !== null && !_isReadInitialPropsFromSSR) {
          // After routing switching, it is considered not the first rendering.
          _initialProps = _initialPropsFromSSR;
          _isReadInitialPropsFromSSR = true;
        } else if (component.getInitialProps) {
          // wait getInitialProps
          component.getInitialProps().then((props) => {
            _initialProps = props;
            setCurrentPath(_currentPagePath);
          }).catch(() => {
            _initialProps = {};
            setCurrentPath(_currentPagePath);
          });
          return null;
        } else {
          setCurrentPath(_currentPagePath);
        }
      }
      return createElement(component, { ...props, ..._initialProps });
    }
  }

  return { Router };
}

export function push(path, state) {
  checkHistory();
  return _history.push(path, state);
}

export function replace(path, state) {
  checkHistory();
  return _history.replace(path, state);
}

export function go(n) {
  checkHistory();
  return _history.go(n);
}

export function goBack() {
  checkHistory();
  return _history.goBack();
}

export function goForward() {
  checkHistory();
  return _history.goForward();
}

export function canGo(n) {
  checkHistory();
  return _history.canGo(n);
}

/**
 * Preload WebApp's page resource.
 * @param config {Object}
 * eg:
 *  1. preload({pageIndex: 0})  // preload dynamic import page bundle
 *  2. preload({href: '//xxx.com/font.woff', as: 'font', crossorigin: true}); // W3C preload
 */
export function preload(config) {
  if (!isWeb) return;
  if (config.pageIndex !== undefined) {
    _routerConfig.routes[config.pageIndex].component();
  } else {
    const linkElement = document.createElement('link');
    linkElement.rel = 'preload';
    linkElement.as = config.as;
    linkElement.href = config.href;
    config.crossorigin && (linkElement.crossorigin = true);
    document.head.appendChild(linkElement);
  }
}

/**
 * Rrerender WebApp's page content.
 * @param config {Object}
 * eg:
 *  1. prerender({pageIndex: 0})  // preload dynamic import page bundle for now(todo page alive)
 *  2. prerender({href:'https://m.taobao.com'}); // W3C prerender
 */
export function prerender(config) {
  if (!isWeb) return;
  if (config.pageIndex !== undefined) {
    _routerConfig.routes[config.pageIndex].component();
  } else {
    const linkElement = document.createElement('link');
    linkElement.rel = 'prerender';
    linkElement.href = config.href;
    document.head.appendChild(linkElement);
  }
}

function checkHistory() {
  if (_history === null) throw new Error('Router not initized properly, please call useRouter first.');
}
