// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
export function assign(target, sources) {
  for (var nextIndex = 1; nextIndex < arguments.length; nextIndex++) {
    var nextSource = arguments[nextIndex];
    if (nextSource == null) {
      continue;
    }

    for (var key in nextSource) {
      target[key] = nextSource[key];
    }
  }

  return target;
}

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
function is(x, y) {
  // SameValue algorithm
  if (x === y) { // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}

/**
 * polyfill Object
 */
export function polyfill(ObjectConstructor = Object) {
  if (!ObjectConstructor.assign) {
    ObjectConstructor.assign = assign;
  }

  if (!ObjectConstructor.is) {
    ObjectConstructor.is = is;
  }
}
