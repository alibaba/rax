/*
 * Ref manager
 */
import { invokeMinifiedError } from '../error';
import { isFunction, isObject } from '../types';
import { INSTANCE } from '../constant';
import warning from '../warning';

export function updateRef(prevElement, nextElement, component) {
  let prevRef = prevElement ? prevElement.ref : null;
  let nextRef = nextElement ? nextElement.ref : null;

  // Update refs in owner component
  if (prevRef !== nextRef) {
    // Detach prev RenderedElement's ref
    prevRef && detachRef(prevElement._owner, prevRef, component);
    // Attach next RenderedElement's ref
    nextRef && attachRef(nextElement._owner, nextRef, component);
  }
}

export function attachRef(ownerComponent, ref, component) {
  if (!ownerComponent) {
    if (process.env.NODE_ENV !== 'production') {
      return warning('ref: multiple version of Rax used in project.');
    } else {
      invokeMinifiedError(3);
    }
  }

  let instance = component.__getPublicInstance();

  if (process.env.NODE_ENV !== 'production') {
    if (instance == null) {
      warning('ref: do not attach ref to function components because they don’t have instances.');
    }
  }

  if (isFunction(ref)) {
    ref(instance);
  } else if (isObject(ref)) {
    ref.current = instance;
  } else {
    ownerComponent[INSTANCE].refs[ref] = instance;
  }
}

export function detachRef(ownerComponent, ref, component) {
  if (isFunction(ref)) {
    // When the referenced component is unmounted and whenever the ref changes, the old ref will be called with null as an argument.
    ref(null);
  } else {
    // Must match component and ref could detach the ref on owner when A's before ref is B's current ref
    let instance = component.__getPublicInstance();

    if (isObject(ref) && ref.current === instance) {
      ref.current = null;
    } else if (ownerComponent[INSTANCE].refs[ref] === instance) {
      delete ownerComponent[INSTANCE].refs[ref];
    }
  }
}
