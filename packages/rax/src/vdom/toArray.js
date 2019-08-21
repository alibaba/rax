import { isArray } from '../is';

export default function toArray(obj) {
  if (!isArray(obj)) {
    obj = [obj];
  }
  return obj;
}
