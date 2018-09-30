const transpiler = require('../../transpiler');

module.exports = (template, { dependencyMap }) => {
  return transpiler(template.content, {
    dependencyMap,
  });
};
