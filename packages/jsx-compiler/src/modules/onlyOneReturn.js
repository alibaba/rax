const t = require('@babel/types');

const PARAM = 'exportedRaxComponentType';

// Example module.
module.exports = {
  parse(ret) {
    const { defaultExportedPath } = ret;
    const { node } = defaultExportedPath;

    if (t.isFunctionDeclaration(node)) {
      ret[PARAM] = 'function';
    } else if (t.isClassDeclaration(node)) {
      ret[PARAM] = 'class';
    } else {
      throw new Error('Should default export something like function or class.');
    }
  },

  generate(ret, parsed) {
    // Expose to result.
    ret[PARAM] = parsed[PARAM];
  },
};
