import { debug } from '../../logger';
import applyFactory from '../../applyFactory';

const componentsHub = {};

/**
 * Register a plugin component.
 * @param pluginName {String} Plugin name.
 * @param componentName {String} Component name.
 * @param factory {Function} Plugin component factory.
 */
export function definePluginComponent({ pluginName, componentName }, factory) {
  const path = `${pluginName}/${componentName}`;
  debug(`Register Plugin Component ${path}`);
  componentsHub[path] = applyFactory(factory);
}

export function getPluginComponent(path) {
  return componentsHub.hasOwnProperty(path) ? componentsHub[path] : null;
}
