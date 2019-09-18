/*
 * Stateful things in runtime
 */
export default {
  __mountID: 1,
  __isUpdating: false,
  // Inject
  driver: null,
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Current owner component
  owner: null,
};
