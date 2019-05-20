const { transformNodeWrapper} = require('../../../transpiler/transpileModules/events');

const LISTENER_ACTION = 'on';

module.exports = {
  transformNode: transformNodeWrapper(LISTENER_ACTION)
};
