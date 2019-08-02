import { createElement, useRef, useImperativeHandle } from 'rax';
import * as RaxUseRouter from 'rax-use-router';
import { isWeex, isWeb } from 'universal-env';
import { createHashHistory } from 'history';
import encodeQS from 'querystring/encode';


let _history = null;
let _routerConfig = {};

export function useRouter(routerConfig) {
  _routerConfig = routerConfig;
  const { history = createHashHistory(), routes } = _routerConfig;
  _history = history;

  function Router(props) {
    const { component } = RaxUseRouter.useRouter(() => _routerConfig);

    if (!component || Array.isArray(component) && component.length === 0) {
      // Return null directly if not matched.
      return null;
    } else {
      return createElement(component, props);
    }
  }

  return { Router };
}

export function Link(props, ref) {
  const defaultType = isWeex ? 'a' : 'span';
  const { to, query, hash, state, type = defaultType, onClick, children, style = {}, ...others } = props;
  const linkRef = useRef(null);

  const throughProps = Object.assign({}, others, {
    onClick: (evt) => {
      if (to) {
        let url = to;
        if (query) url += '?' + encodeQS(query);
        if (hash) url += '#' + hash;
        push(url, state);
      }
      onClick && onClick(evt);
    }
  });

  let content = children;
  if (typeof children === 'string') {
    const textStyle = Object.assign({
      border: '0 solid black',
      boxSizing: 'border-box',
      display: 'block',
      flexDirection: 'column',
      alignContent: 'flex-start',
      flexShrink: 0,
    }, {
      color: style.color,
      lines: style.lines,
      fontSize: style.fontSize,
      fontStyle: style.fontStyle,
      fontWeight: style.fontWeight,
      textDecoration: style.textDecoration || 'none',
      textAlign: style.textAlign,
      fontFamily: style.fontFamily,
      textOverflow: style.textOverflow,
    });
    content = createElement(isWeex ? 'text' : 'span', { style: textStyle, children });
    throughProps.children = content;
  } else {
    throughProps.children = children;
  }

  useImperativeHandle(ref, () => ({
    _nativeNode: linkRef.current
  }));
  throughProps.ref = linkRef;

  return createElement(type, throughProps);
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