const { transformNodeWrapper} = require('../../../transpiler/transpileModules/web-view');

const MESSAGE_ATTRIBUTE = 'bindmessage';

module.exports = {
  transformNode: transformNodeWrapper(MESSAGE_ATTRIBUTE)
};
