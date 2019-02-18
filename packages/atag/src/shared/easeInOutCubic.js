/**
 * An ease-in-out cubic-function.
 * @param t {Number} Input value.
 * @return {number} Output value.
 */
export default function easeInOutCubic(t) {
  return t < .5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
}
