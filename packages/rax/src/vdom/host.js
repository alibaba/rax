/*
 * Stateful things in runtime
 */
export default {
  mountID: 1,
  // Current owner component
  owner: null,
  __isUpdating: false,
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Inject
  driver: null,
};
