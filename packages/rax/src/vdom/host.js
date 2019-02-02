/*
 * Stateful things in runtime
 */
export default {
  mountID: 1,
  component: null,
  isUpdating: false,
  dirtyComponents: [],
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Inject
  driver: null,
};
