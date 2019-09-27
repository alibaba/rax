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

export const shared = {
  Host,
  Instance,
  Element,
  flattenChildren
};
