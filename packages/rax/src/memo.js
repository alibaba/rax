import shallowEqual from './vdom/shallowEqual';

export default function memo(type, compare = shallowEqual) {
  type.compare = compare;
  return type;
}