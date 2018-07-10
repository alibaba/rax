const on = require('./on');
const bind = require('./bind');
const { noop } = require('../../shared/utils');

module.exports = {
  on,
  bind,
  cloak: noop
};
