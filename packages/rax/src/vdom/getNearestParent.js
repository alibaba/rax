import { INTERNAL } from '../constant';

export default function getNearestParent(instance, matcher) {
  let parent;
  while (instance && instance[INTERNAL]) {
    if (matcher(instance)) {
      parent = instance;
      break;
    }
    instance = instance[INTERNAL].__parentInstance;
  }
  return parent;
}