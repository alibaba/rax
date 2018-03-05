export default function resolvePlugins(plugins) {
  return plugins.map(function(plugin) {
    // Normalise plugin to an array.
    if (!Array.isArray(plugin)) {
      plugin = [plugin];
    }
    // Only resolve the plugin if it's a string reference.
    if (typeof plugin[0] === 'string') {
      plugin[0] = require('babel-plugin-' + plugin[0]);
      plugin[0] = plugin[0].__esModule ? plugin[0].default : plugin[0];
    }
    return plugin;
  });
}
