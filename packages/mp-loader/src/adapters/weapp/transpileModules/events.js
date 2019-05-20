const { transformNodeWrapper} = require('../../../transpiler/transpileModules/events');

const LISTENER_ACTION = 'bind';

module.exports = {
  transformNode: transformNodeWrapper(LISTENER_ACTION)
};
