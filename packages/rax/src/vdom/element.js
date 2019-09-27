export default function Element(type, key, ref, props, owner) {
  let element = {
    // Built-in properties that belong on the element
    type,
    key,
    ref,
    props,
    // Record the component responsible for creating this element.
    _owner: owner,
  };

  if (process.env.NODE_ENV !== 'production') {
    // We make validation flag non-enumerable, so the test framework could ignore it
    Object.defineProperty(element, '__validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
  }

  return element;
};
