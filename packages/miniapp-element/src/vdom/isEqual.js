export default function isEqual(a, b) {
  if (typeof a === 'number' && typeof b === 'number') {
    return parseInt(a * 1000, 10) === parseInt(b * 1000, 10);
  }

  return a === b;
}
