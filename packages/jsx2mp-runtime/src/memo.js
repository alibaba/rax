import shallowEqual from './shallowEqual';

export default function(Component, compare) {
  compare = compare || shallowEqual;
  // Memo could composed
  if (Component.__compares) {
    Component.__compares.push(compare);
  } else {
    Component.__compares = [compare];
  }

  return Component;
}
