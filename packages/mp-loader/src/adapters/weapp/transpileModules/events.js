const { createTransformNode } = require('../../../transpiler/transformCreator/events');

const LISTENER_ACTION = 'bind';

module.exports = {
  transformNode: createTransformNode(LISTENER_ACTION)
};
