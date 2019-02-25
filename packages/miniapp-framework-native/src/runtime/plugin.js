import {
  definePluginPage,
  definePluginComponent,
  definePluginAPI
} from 'miniapp-framework-shared/src/worker/plugin';
import regeneratorRuntime from 'regenerator-runtime';

export const __DEFINE_PLUGIN_PAGE__ = definePluginPage;
export const __DEFINE_PLUGIN_COMPONENT__ = definePluginComponent;
export const __DEFINE_PLUGIN_API__ = definePluginAPI;

/**
 * For native recognize local assets schema.
 */
export const __file_schema_prefix__ = 'https://windmill';

/**
 * Method for polyfill ES.
 */
export { default as polyfill } from 'miniapp-framework-shared/src/polyfill';

/**
 * Compatible with regenerator runtime to support async-await.
 * TODO: deperate reference at runtime.
 */
export { regeneratorRuntime };
