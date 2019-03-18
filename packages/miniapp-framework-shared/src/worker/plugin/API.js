import { debug } from '../../logger';
import applyFactory from '../../applyFactory';

const APIExports = {};

/**
 * Register a plugin api.
 * @param pluginName {String} Plugin name.
 * @param factory {Function} Plugin api factory.
 */
export function definePluginAPI({ pluginName }, factory) {
  debug(`Register Plugin API ${pluginName}`);
  APIExports[pluginName] = applyFactory(factory);
}

export function getPluginAPI(pluginName) {
  return APIExports[pluginName];
}
