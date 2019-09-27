import nextTick from './nextTick';
import { RENDER } from './cycles';

let queue = [];

export function enqueueRender(component) {
  if (!component.__isQueued && (component.__isQueued = true) && queue.push(component) === 1) {
    nextTick(rerender);
  }
}

export function rerender() {
  const list = queue;
  queue = [];
  let component;
  // eslint-disable-next-line
  while (component = list.pop()) {
    if (component.__isQueued) {
      component._updateComponent();
      component.__isQueued = false;
    }
  }
}
