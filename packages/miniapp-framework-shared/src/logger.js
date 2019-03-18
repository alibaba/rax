const DEBUG_MESSAGE_PREFIX = '[MiniApp]';

/**
 * Always log message.
 * @Note: Only pass one param, for native log only receive first param.
 */
export function log(...args) {
  let str = DEBUG_MESSAGE_PREFIX;
  for (let i = 0, l = args.length; i < l; i++) {
    str += args[i];
  }
  console.log(str);
}

/**
 * Export message in development mode.
 */
export function debug(...args) {
  if (process.env.NODE_ENV === 'development') {
    let str = DEBUG_MESSAGE_PREFIX;
    for (let i = 0, l = args.length; i < l; i++) {
      str += args[i];
    }
    console.warn(str);
  }
}
