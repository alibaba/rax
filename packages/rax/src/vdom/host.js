import Heap from './ComponentHeap';
/*
 * Stateful things in runtime
 */
export default {
  component: null,
  mountID: 1,
  isRendering: false,
  dirtyComponents: new Heap(),
  sandbox: true,
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Inject
  hook: null,
  driver: null,
  monitor: null
};
