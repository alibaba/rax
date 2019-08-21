/*
 * Ref manager
 */
import { invokeMinifiedError } from '../error';
import { isFunction, isObject } from '../is';

export default {
  update(prevElement, nextElement, component) {
    let prevRef = prevElement && prevElement.ref || null;
    let nextRef = nextElement && nextElement.ref || null;

    // Update refs in owner component
    if (prevRef !== nextRef) {
      // Detach prev RenderedElement's ref
      prevRef != null && this.detach(prevElement._owner, prevRef, component);
      // Attach next RenderedElement's ref
      nextRef != null && this.attach(nextElement._owner, nextRef, component);
    }
  },
  attach(ownerComponent, ref, component) {
    if (!ownerComponent) {
      if (process.env.NODE_ENV !== 'production') {
        return console.error('ref: multiple version of Rax used in project.');
      } else {
        invokeMinifiedError(3);
      }
    }

    let instance = component.getPublicInstance();

    if (process.env.NODE_ENV !== 'production') {
      if (instance == null) {
        console.error('ref: do not attach ref to function components because they don’t have instances.');
      }
    }

    if (isFunction(ref)) {
      ref(instance);
    } else if (isObject(ref)) {
      ref.current = instance;
    } else {
      ownerComponent._instance.refs[ref] = instance;
    }
  },
  detach(ownerComponent, ref, component) {
    if (isFunction(ref)) {
      // When the referenced component is unmounted and whenever the ref changes, the old ref will be called with null as an argument.
      ref(null);
    } else {
      // Must match component and ref could detach the ref on owner when A's before ref is B's current ref
      let instance = component.getPublicInstance();

      if (isObject(ref) && ref.current === instance) {
        ref.current = null;
      } else if (ownerComponent._instance.refs[ref] === instance) {
        delete ownerComponent._instance.refs[ref];
      }
    }
  }
};
