import nextTick from './nextTick';
import { RENDER } from './cycles';

let queue = [];

export function enqueueRender(component) {
  if (queue.push(component) === 1) nextTick(rerender);
}

export function rerender() {
  const list = queue;
  queue = [];
  let component;
  // eslint-disable-next-line
  while (component = list.pop()) {
    component._updateComponent();
  }
}
