import getNearestParent from './getNearestParent';
import { scheduler, scheduleLayout } from './scheduler';
import { INTERNAL } from '../constant';

export default function performInSandbox(fn, instance, callback) {
  try {
    return fn();
  } catch (e) {
    if (callback) {
      callback(e);
    } else {
      handleError(instance, e);
    }
  }
}

/**
 * A class component becomes an error boundary if
 * it defines either (or both) of the lifecycle methods static getDerivedStateFromError() or componentDidCatch().
 * Use static getDerivedStateFromError() to render a fallback UI after an error has been thrown.
 * Use componentDidCatch() to log error information.
 * @param {*} instance
 * @param {*} error
 */
export function handleError(instance, error) {
  let boundary = getNearestParent(instance, parent => {
    return parent.componentDidCatch || parent.constructor && parent.constructor.getDerivedStateFromError;
  });

  if (boundary) {
    scheduleLayout(() => {
      const boundaryInternal = boundary[INTERNAL];
      // Should not attempt to recover an unmounting error boundary
      if (boundaryInternal) {
        performInSandbox(() => {
          if (boundary.componentDidCatch) {
            boundary.componentDidCatch(error);
          }

          // Update state to the next render to show the fallback UI.
          if (boundary.constructor && boundary.constructor.getDerivedStateFromError) {
            const state = boundary.constructor.getDerivedStateFromError(error);
            boundary.setState(state);
          }
        }, boundaryInternal.__parentInstance);
      }
    });
  } else {
    // Do not break when error happens
    scheduler(() => {
      throw error;
    }, 0);
  }
}
