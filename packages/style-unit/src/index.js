const RPX_REG = /[-+]?\d*\.?\d+rpx/g;
const GLOBAL_RPX_UNIT = '__rpx_coefficient__';
const global =
  typeof window === 'object'
    ? window
    : typeof global === 'object'
      ? global
      : {};

// Dedault decimal transformer.
let decimalPixelTransformer = (rpx) => parseFloat(rpx) * getRpx() + 'px';

// Default 1 rpx to 1 px
if (getRpx() === undefined) {
  setRpx(1);
}

/**
 * Is string contains rpx
 * note: rpx is an alias to rpx
 * @param {String} str
 * @returns {Boolean}
 */
export function isRpx(str) {
  return typeof str === 'string' && RPX_REG.test(str);
}

/**
 * Calculate rpx to pixels: '1.2rpx' => 1.2 * rpx
 * @param {String} str
 * @returns {String}
 */
export function calcRpx(str) {
  return str.replace(RPX_REG, decimalPixelTransformer);
}

export function getRpx() {
  return global[GLOBAL_RPX_UNIT];
}

export function setRpx(rpx) {
  global[GLOBAL_RPX_UNIT] = rpx;
}

/**
 * Set a function to transform unit of pixel,
 * default to passthrough.
 * @param {Function} transformer function
 */
export function setDecimalPixelTransformer(transformer) {
  decimalPixelTransformer = transformer;
}

const cache = Object.create(null);
/**
 * Convert rpx.
 * @param value
 * @param prop
 * @return {String} Transformed value.
 */
export function convertUnit(value, prop) {
  const cacheKey = `${prop}-${value}`;
  const hit = cache[cacheKey];
  if (hit) {
    return hit;
  } else {
    value = value + '';
    return cache[cacheKey] = isRpx(value) ? calcRpx(value) : value;
  }
}
