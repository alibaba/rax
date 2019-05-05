const t = require('@babel/types');

// Example module.
module.exports = {
  parse(ret) {
    const { defaultExportedPath } = ret;
    const { node } = defaultExportedPath;

    if (t.isFunctionDeclaration(node)) {

    } else if (t.isClassDeclaration(node)) {

    } else {
      throw new Error('Should default export something like function or class.')
    }
  },

  generate(node, state) {

  },
};
