/*
 * Stateful things in runtime
 */
export default {
  component: null,
  mountID: 1,
  isRendering: false,
  dirtyComponents: [],
  sandbox: true,
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Inject
  hook: null,
  driver: null,
  monitor: null
};
