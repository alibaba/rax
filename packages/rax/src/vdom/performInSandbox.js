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

export function handleError(instance, error) {
  let boundary = getNearestParent(instance, parent => parent.componentDidCatch);

  if (boundary) {
    scheduleLayout(() => {
      const boundaryInternal = boundary[INTERNAL];
      // Should not attempt to recover an unmounting error boundary
      if (boundaryInternal) {
        performInSandbox(() => {
          boundary.componentDidCatch(error);

          if (boundary.constructor.getDerivedStateFromError) {
            const state = boundary.constructor.getDerivedStateFromError();
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
