export default function toArray(obj) {
  if (!Array.isArray(obj)) {
    obj = [obj];
  }
  return obj;
}