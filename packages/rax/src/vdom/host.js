/*
 * Stateful things in runtime
 */
export default {
  mountID: 1,
  component: null,
  isUpdating: false,
  // Roots
  rootComponents: {},
  rootInstances: {},
  // Inject
  driver: null,
};
