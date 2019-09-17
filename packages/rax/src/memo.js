import shallowEqual from './vdom/shallowEqual';

export default function memo(type, compare) {
  compare = compare || shallowEqual;

  // Memo could composed
  if (type.__compares) {
    type.__compares.push(compare);
  } else {
    type.__compares = [compare];
  }

  return type;
}
