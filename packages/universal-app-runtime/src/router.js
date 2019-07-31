import { createElement } from 'rax';
import * as RaxUseRouter from 'rax-use-router';
import { createHashHistory } from 'history';
import encodeQS from 'querystring/encode';

let _history = null;

export function useRouter(routerConfig) {
  const { history = createHashHistory(), routes } = routerConfig;
  _history = history;

  function Router(props) {
    const { component } = RaxUseRouter.useRouter(() => routerConfig);

    if (!component || (Array.isArray(component) && component.length === 0)) {
      // Return null directly if not matched.
      return null;
    } else {
      return createElement(component, props);
    }
  }

  return { Router };
}

export function Link(props) {
  const { to, query, hash, state, type = 'span', onClick, ...others } = props;
  const throughProps = Object.assign({}, others, {
    onClick: (evt) => {
      if (to) {
        let url = to;
        if (query) url += '?' + encodeQS(query);
        if (hash) url += '#' + hash;
        push(url, state);
      }
      onClick(evt);
    }
  });
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

function checkHistory() {
  if (_history === null) throw new Error('Router not initized properly, please call useRouter first.');
}
