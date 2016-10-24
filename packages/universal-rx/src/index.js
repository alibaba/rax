import {isWeb} from 'universal-env';

if (isWeb) {
  if (window.__RX__) {
    console.warn('Multiple (conflicting) copies of Rx loaded, make sure to use only one.');
  } else {
    window.__RX__ = true;
  }
}

export {createElement, cloneElement, isValidElement, createFactory} from './element';
export Component from './component';
export PureComponent from './purecomponent';
export PropTypes from './proptypes';

export render from './render';
export findDOMNode from './findDOMNode';
export unmountComponentAtNode from './unmountComponentAtNode';
export findComponentInstance from './findComponentInstance';
export setNativeProps from './setNativeProps';
export version from './version';
