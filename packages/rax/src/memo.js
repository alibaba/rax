import shallowEqual from './vdom/shallowEqual';

export default function memo(type, compare = shallowEqual) {
  // Memo could composed
  if (type.compares) {
    type.compares.push(compare);
  } else {
    type.compares = [compare];
  }

  return type;
}