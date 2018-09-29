const transpiler = require('../../transpiler');

module.exports = (template, { tplImports }) => {
  return transpiler(template.content, {
    tplImports,
  });
};
