import createElement from './createElement';
import createContext from './createContext';
import createRef from './createRef';
import {useState, useContext, useEffect, useLayoutEffect, useRef, useCallback, useMemo, useReducer, useImperativeHandle} from './hooks';
import memo from './memo';
import Fragment from './fragment';
import render from './render';
import Component, { PureComponent } from './vdom/component';
import version from './version';
import Host from './vdom/host';
import Instance from './vdom/instance';
import Element from './vdom/element';
import flattenChildren from './vdom/flattenChildren';

const shared = {
  Host,
  Instance,
  Element,
  flattenChildren
};

export {
  createElement, createRef, createContext,
  useState, useContext, useEffect, useLayoutEffect, useRef, useCallback, useMemo, useReducer, useImperativeHandle,
  Component, PureComponent,
  Fragment, memo,
  render,
  version,
  shared
};
