export createElement from './createElement';
export createContext from './createContext';
export createRef from './createRef';
export forwardRef from './forwardRef';
export { useState, useContext, useEffect, useLayoutEffect, useRef, useCallback, useMemo, useReducer, useImperativeHandle } from './hooks';
export memo from './memo';
export Fragment from './fragment';
export render from './render';
export Component, { PureComponent } from './vdom/component';
export version from './version';

import Host from './vdom/host';
import Instance from './vdom/instance';
import Element from './vdom/element';
import flattenChildren from './vdom/flattenChildren';
import DevtoolsHook from './devtools/index';

export const shared = {
  Host,
  Instance,
  Element,
  flattenChildren
};

if (process.env.NODE_ENV !== 'production') {
  /* global __RAX_DEVTOOLS_GLOBAL_HOOK__ */
  if (typeof __RAX_DEVTOOLS_GLOBAL_HOOK__ !== 'undefined' &&
    typeof __RAX_DEVTOOLS_GLOBAL_HOOK__.inject === 'function') {
    __RAX_DEVTOOLS_GLOBAL_HOOK__.inject(DevtoolsHook);
  }

  if (typeof window !== 'undefined') {
    if (window.__RAX_INITIALISED__) {
      console.error('Warning: more than one instance of Rax has been initialised, this could lead to unexpected behaviour.');
    }
    window.__RAX_INITIALISED__ = true;
  }
}
