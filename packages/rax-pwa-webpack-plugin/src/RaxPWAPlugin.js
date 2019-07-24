/**
 * PWA Plugin
 * Add or modify some project files according to the configuration of project app.json,
 * update the construction configuration, and achieve the purpose of experience enhancement
 *
 */

const RaxPWAPlugins = require('./config/RaxPWAPlugins');

class RaxPWAPlugin {
  constructor(options) {
    this.options = options;
  }

  apply(compiler) {
    if (Array.isArray(compiler.options.plugins)) {
      RaxPWAPlugins.forEach((Plugin) => {
        compiler.options.plugins.push(new Plugin(this.options));
      });
    }
  }
}

module.exports = RaxPWAPlugin;
