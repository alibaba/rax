import createEmptyElement from './createEmptyElement';

/**
 * Create not impl warn.
 * @param text {String} Warning
 * @param alias? {Function} Generate an element instead.
 * @return {Element} Not impl warn element.
 */
export default function createNotImplWarn(text, alias) {
  return function() {
    console.warn(`${text} is not implemented.`);

    if (alias) {
      return alias.apply(this, arguments);
    } else {
      return createEmptyElement();
    }
  };
}
