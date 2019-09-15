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
    // we put element validation flag into this object
    Object.defineProperty(element, '_store', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: {}
    });

    // we make validation flag non-enumerable, so the test framework could ignore it
    Object.defineProperty(element._store, 'validated', {
      configurable: false,
      enumerable: false,
      writable: true,
      value: false
    });
  }

  return element;
};
