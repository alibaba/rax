/**
* Tries to stringify with JSON.stringify and toString, but catches exceptions
* (e.g. from circular objects) and always returns a string and never throws.
*/
export function stringifySafe(arg) {
  let ret;
  const type = typeof arg;
  if (arg === undefined) {
    ret = 'undefined';
  } else if (arg === null) {
    ret = 'null';
  } else if (type === 'string') {
    ret = '"' + arg + '"';
  } else if (type === 'function') {
    try {
      ret = arg.toString();
    } catch (e) {
      ret = '[function unknown]';
    }
  } else {
    // Perform a try catch, just in case the object has a circular
    // reference or stringify throws for some other reason.
    try {
      ret = JSON.stringify(arg);
    } catch (e) {
      if (typeof arg.toString === 'function') {
        try {
          ret = arg.toString();
        } catch (E) { }
      }
    }
  }
  return ret || '["' + type + '" failed to stringify]';
}

/**
 * make JSON.stringify safe
 */
export function polyfill(JSONObject = JSON) {
  JSON.stringify = stringifySafe;
}
