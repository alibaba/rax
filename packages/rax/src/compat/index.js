import * as RaxCore from '../../index';
import Children from 'rax-children';
import isValidElement from 'rax-is-valid-element';
import createFactory from 'rax-create-factory';
import cloneElement from 'rax-clone-element';

const Rax = RaxCore;

Rax.Children = Children;
Rax.isValidElement = isValidElement;
Rax.createFactory = createFactory;
Rax.cloneElement = cloneElement;
Rax.Component.prototype.isReactComponent = {};

export * from '../../index';
export {
  Children,
  isValidElement,
  createFactory,
  cloneElement,
};
export default Rax;
