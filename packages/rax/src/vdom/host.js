/*
 * Stateful things in runtime
 */
export default {
  __mountID: 1,
  __isUpdating: false,
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Current owner component
  owner: null,
  // Inject
  driver: null,
};
