/* global my */
import { RENDER } from './cycles';
const nextTick = my.nextTick ? my.nextTick : setTimeout;
let queue = [];

export function enqueueRender(component) {
  if (queue.push(component) === 1) nextTick(rerender);
}

export function rerender() {
  const list = queue;
  queue = [];
  let component;
  while ((component = list.pop())) {
    if (component._dirty) component._trigger(RENDER);
  }
}
