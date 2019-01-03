/**
 * Logger and Debugger methods
 */

import global from './global';

const LEVEL_PRIVILLIGE = {
  all: -1,
  debug: 0,
  log: 1,
  info: 1,
  warn: 2,
  error: 3,
  none: 4
};

/**
 * debug > log(info) > warn > error
 * development 包默认 all
 * production 包默认 error
 */
let level = 'error';
if (process.env.NODE_ENV === 'development') {
  level = 'all';
}
/**
 * set log level
 * @param {String} _level
 */
export function setLogLevel(_level) {
  level = _level;
}

/**
 * Set a global __set_log_level__
 */
try {
  global.__set_log_level__ = setLogLevel;
} catch (err) {
  warn('mount __set_log_level__ at global object err', err);
}
/**
 * log
 * @params {String} args 输出内容
 */
export function log(...args) {
  if (LEVEL_PRIVILLIGE[level] <= LEVEL_PRIVILLIGE.log) {
    console.log('[Log]', ...args);
  }
}

/**
 * debug
 * @params {String} args 输出内容
 */
export function debug(...args) {
  if (LEVEL_PRIVILLIGE[level] <= LEVEL_PRIVILLIGE.debug) {
    console.log('[Debug]', ...args);
  }
}

/**
 * warn
 * @params {String} args 输出内容
 */
export function warn(...args) {
  if (LEVEL_PRIVILLIGE[level] <= LEVEL_PRIVILLIGE.warn) {
    console.log('[WARN]', ...args);
  }
}

/**
 * error
 * @params {String} args 输出内容
 */
export function error(...args) {
  if (LEVEL_PRIVILLIGE[level] <= LEVEL_PRIVILLIGE.error) {
    console.log('[ERROR]', ...args);
  }
}
