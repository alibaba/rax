import { isArray } from './types';

export default function toArray(obj) {
  return isArray(obj) ? obj : [obj];
}
