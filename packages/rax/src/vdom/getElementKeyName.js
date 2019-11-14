import { isString } from '../types';
import { warning } from '../error';

export default function getElementKeyName(children, element, index) {
  const elementKey = element && element.key;
  const defaultName = '.' + index.toString(36); // Inner child name default format fallback

  // Key should must be string type
  if (isString(elementKey)) {
    let keyName = '$' + elementKey;
    // Child keys must be unique.
    let keyUnique = children[keyName] === undefined;

    if (process.env.NODE_ENV !== 'production') {
      if (!keyUnique) {
        // Only the first child will be used when encountered two children with the same key
        warning(`Encountered two children with the same key "${elementKey}".`);
      }
    }

    return keyUnique ? keyName : defaultName;
  } else {
    return defaultName;
  }
}
