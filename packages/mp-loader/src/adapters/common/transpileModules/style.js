const { createTransformNode, staticKeys, genData } = require('../../../transpiler/transformCreator/style');

module.exports = {
  transformNode: createTransformNode(),
  staticKeys,
  genData
};
