const { join, relative, dirname } = require('path');

const ADAPTER_REPLACER = '@@ADAPTER@@';
const adapterPath = join(__dirname, '../src/adapter');

module.exports = function({ types: t }, { platform = 'ali' }) {
  const targetAdapterFilename = join(adapterPath, platform);

  return {
    name: 'import-adapter-replace-plugin',
    visitor: {
      StringLiteral(path, { filename }) {
        const { node } = path;
        if (node.value === ADAPTER_REPLACER) {
          let rel = relative(dirname(filename), targetAdapterFilename);
          if (rel[0] !== '.') rel = './' + rel; // add `./` prefix for relative filename.

          path.replaceWith(t.stringLiteral(rel));
        }
      },
    }
  };
};
