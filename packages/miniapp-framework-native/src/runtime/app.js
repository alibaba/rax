/* expose host global object for JSC Worker */
import { global, worker } from 'miniapp-framework-shared';
import regeneratorRuntime from 'regenerator-runtime';

const getPluginPart = worker.plugin.getPluginPart;
const MODULE_API = '__WINDMILL_MODULE_API__';
const moduleAPI = global[MODULE_API];

/**
 * Compatible with regenerator runtime to support async-await.
 * TODO: deperate reference at runtime.
 */
export { regeneratorRuntime };

/**
 * Generate my api instance.
 */
export const { my } = moduleAPI.getAPIs();

/**
 * For native recognize local assets schema.
 */
export const __file_schema_prefix__ = 'https://windmill';

/**
 * For miniapp to get runtime module.
 */
export { default as require } from '../getModule';

/**
 * Method for polyfill ES.
 */
export { default as polyfill } from 'miniapp-framework-shared/src/polyfill';

/**
 * Public API `requirePlugin` is equal to require api from plugin.
 * __REQUIRE_PLUGIN__ is for page and component renderring.
 */
export const requirePlugin = getPluginPart.bind(null, 'api');
export const __REQUIRE_PLUGIN__ = getPluginPart;
