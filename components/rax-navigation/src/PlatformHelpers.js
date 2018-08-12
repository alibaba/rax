/* @flow */

export const Linking = {
  addEventListener: () => {},
  removeEventListener: () => {},
  getInitialURL: () => Promise.resolve(typeof location === 'object' && location.href),
};

export const BackAndroid = {
  addEventListener: () => {},
};
