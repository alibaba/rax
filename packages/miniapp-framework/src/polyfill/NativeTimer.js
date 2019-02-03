/**
 * works in android JSC
 */

// delay's default to 0 ms
export function setTimeout(fn, delay = 0, ...args) {
  // eslint-disable-next-line
  return setNativeTimeout(fn.bind(this, ...args), delay);
}

// setInterval delay have no default value
export function setInterval(fn, delay, ...args) {
  // eslint-disable-next-line
  return setNativeInterval(fn.bind(this, ...args), delay);
}

export function clearTimeout(timeoutID) {
  // eslint-disable-next-line
  return clearNativeTimeout(timeoutID);
}

export function clearInterval(intervalID) {
  // eslint-disable-next-line
  return clearNativeInterval(intervalID);
}
