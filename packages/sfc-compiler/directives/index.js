const on = require('./on');
const bind = require('./bind');
const { noop } = require('sfc-shared-utils');

module.exports = {
  on,
  bind,
  cloak: noop
};
