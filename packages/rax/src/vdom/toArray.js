import { isArray } from '../types';

export default function toArray(obj) {
  if (!isArray(obj)) {
    obj = [obj];
  }
  return obj;
}
