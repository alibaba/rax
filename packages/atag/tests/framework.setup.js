/* eslint-disable import/no-extraneous-dependencies */
const { toMatchImageSnapshot } = require('jest-image-snapshot');

expect.extend({ toMatchImageSnapshot });

global.__VIEWPORT__ = {
  width: 414,
  height: 736,
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  isLandscape: false,
};
