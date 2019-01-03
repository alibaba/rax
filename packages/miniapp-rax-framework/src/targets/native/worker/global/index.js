/* eslint-disable no-undef */
/**
 * expose host global object for JSC Worker
 */
import getContextObject from '../utils/getContextObject';

export { default as navigator } from './navigator';

const global = getContextObject();
export const devicePixelRatio = typeof __windmill_environment__ === 'object'
  ? __windmill_environment__.pixelRatio : 1;
export const __file_schema_prefix__ = 'https://windmill';
