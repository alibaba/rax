import { register } from '../pageHub';

/**
 * Register a plugin page.
 * @param pluginName {String} Plugin name.
 * @param pageName {String} Page name.
 * @param factory {Function} PageComponent factory.
 */
export function definePluginPage({ pluginName, pageName }, factory) {
  const pageDescriptor = { page: `plugin://${pluginName}/${pageName}` };
  return register(pageDescriptor, factory);
}
