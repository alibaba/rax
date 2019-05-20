const { transformNodeWrapper} = require('../../../transpiler/transpileModules/web-view');

const MESSAGE_ATTRIBUTE = 'onMessage';

module.exports = {
  transformNode: transformNodeWrapper(MESSAGE_ATTRIBUTE)
};
