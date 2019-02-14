const DEBUG_MESSAGE_PREFIX = '[MiniAppFrameworkDebug]';

/**
 * Always log message.
 */
export function log(...args) {
  console.log(DEBUG_MESSAGE_PREFIX, ...args);
}

/**
 * Export message in development mode.
 */
export function debug(...args) {
  if (process.env.NODE_ENV === 'development') {
    console.warn(DEBUG_MESSAGE_PREFIX, ...args);
  }
}
