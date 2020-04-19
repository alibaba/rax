function getIteratorFn(obj) {
  const iteratorFn = obj && (
    typeof Symbol === 'function' && typeof Symbol.iterator === 'symbol' && obj[Symbol.iterator]
    || obj['@@iterator']
  );

  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }

  return undefined;
}

function isIterable(obj) {
  return !!getIteratorFn(obj);
}

export function isArrayLike(obj) {
  return Array.isArray(obj) || typeof obj !== 'string' && isIterable(obj);
}

export function mapFind(arraylike, mapper, finder) {
  let found;
  const isFound = Array.prototype.find.call(arraylike, (item) => {
    found = mapper(item);
    return finder(found);
  });
  return isFound ? found : undefined;
}

export function flatten(arrs) {
  // optimize for the most common case
  if (Array.isArray(arrs)) {
    return arrs.reduce(
      (flatArrs, item) => flatArrs.concat(isArrayLike(item) ? flatten(item) : item),
      [],
    );
  }

  // fallback for arbitrary iterable children
  let flatArrs = [];

  const iteratorFn = getIteratorFn(arrs);
  const iterator = iteratorFn.call(arrs);

  let step = iterator.next();

  while (!step.done) {
    const item = step.value;
    let flatItem;

    if (isArrayLike(item)) {
      flatItem = flatten(item);
    } else {
      flatItem = item;
    }

    flatArrs = flatArrs.concat(flatItem);

    step = iterator.next();
  }

  return flatArrs;
}

export function ensureKeyOrUndefined(key) {
  return key || (key === '' ? '' : undefined);
}

export function propFromEvent(eventName, eventOptions = {}) {
  return `on${eventName[0].toUpperCase()}${eventName.slice(1)}`;
}
