const { extname } = require('path');

module.exports = ({ file, options, env }) => ({
  plugins: [
    require('postcss-import')({ resolve: styleResolver }),
    require('../plugins/PostcssPluginRpx2rem'),
    require('../plugins/PostcssPluginTagPrefix'),
    require('autoprefixer')
  ]
})

const ABSOLUTE_REG = /^\//;
const RELATIVE_REG = /^\./;
const STYLE_EXT = '.css';
/**
 * Resolve postcss file path
 * eg.
 *   @import "./button.acss"; // relative path
 *   @import "/button.acss"; // absolute path to project
 *   @import "third-party/button.acss"; // npm package
 */
function styleResolver(id, basedir, importOptions) {
  let filePath;
  if (ABSOLUTE_REG.test(id)) {
    filePath = join(importOptions.root, id);
  } else if (RELATIVE_REG.test(id)) {
    filePath = join(basedir, id);
  } else {
    filePath = require.resolve(id, {
      paths: [join(importOptions.root, 'node_modules')]
    });
  }

  /**
   * Allow to ignore extension, default to .acss
   */
  if (extname(filePath) !== STYLE_EXT) {
    filePath = filePath + STYLE_EXT;
  }

  return filePath;
}
