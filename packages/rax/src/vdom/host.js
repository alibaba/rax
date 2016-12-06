/*
 * Stateful things in runtime
 */
export default {
  component: null,
  driver: null,
  document: typeof document === 'object' ? document : {},
  mountID: 1,
  // Roots
  rootComponents: {},
  rootInstances: {},
};
