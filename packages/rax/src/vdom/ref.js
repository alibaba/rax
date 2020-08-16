/*
 * Ref manager
 */
import { isFunction, isObject } from '../types';
import { INSTANCE } from '../constant';
import { warning, throwMinifiedWarn } from '../error';

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
      warning('Ref can not attach because multiple copies of Rax are used.');
    } else {
      throwMinifiedWarn(3);
    }
    return;
  }

  let instance = component.__getPublicInstance();

  if (process.env.NODE_ENV !== 'production') {
    if (instance == null) {
      warning('Do not attach ref to function component because they don’t have instances.');
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
