import { isWeb, isWeex } from 'universal-env';

const RPX_REG = /"[^"]+"|'[^']+'|url\([^\)]+\)|(\d*\.?\d+)rpx/g;
let __rpx_coefficient__;
let __viewport_width__;

// convertUnit method targetPlatform
let targetPlatform = isWeb ? 'web' : isWeex ? 'weex' : '';

// Init toFixed method
let unitPrecision = 4;

const toFixed = (number, precision) => {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
};

// Dedault decimal px transformer.
let decimalPixelTransformer = (rpx, $1) => $1 ? parseFloat(rpx) * getRpx() + 'px' : rpx;

// Default decimal vw transformer.
const decimalVWTransformer = (rpx, $1) => $1 ? toFixed(parseFloat(rpx) / (getViewportWidth() / 100), unitPrecision) + 'vw' : rpx;

// Default 1 rpx to 1 px
if (getRpx() === undefined) {
  setRpx(1);
}

// Viewport width, default to 750.
if (getViewportWidth() === undefined) {
  setViewportWidth(750);
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
 * Calculate rpx
 * @param {String} str
 * @returns {String}
 */
export function calcRpx(str) {
  if (targetPlatform === 'web') {
    // In Web convert rpx to 'vw', same as driver-dom and driver-universal
    // '375rpx' => '50vw'
    return str.replace(RPX_REG, decimalVWTransformer);
  } else if (targetPlatform === 'weex') {
    // In Weex convert rpx to 'px'
    // '375rpx' => 375 * px
    return str.replace(RPX_REG, decimalPixelTransformer);
  } else {
    // Other platform return original value, like Mini-App and WX Mini-Program ...
    // '375rpx' => '375rpx'
    return str;
  }
}

export function getRpx() {
  return __rpx_coefficient__;
}

export function setRpx(rpx) {
  __rpx_coefficient__ = rpx;
}

export function getViewportWidth() {
  return __viewport_width__;
}

export function setViewportWidth(viewport) {
  __viewport_width__ = viewport;
}

/**
 * Set a function to transform unit of pixel,
 * default to passthrough.
 * @param {Function} transformer function
 */
export function setDecimalPixelTransformer(transformer) {
  decimalPixelTransformer = transformer;
}

/**
 * Set unit precision.
 * @param n {Number} Unit precision, default to 4.
 */
export function setUnitPrecision(n) {
  unitPrecision = n;
}

/**
 * Create a cached version of a pure function.
 * Use the first params as cache key.
 */
export function cached(fn) {
  const cache = new Map();
  return function cachedFn(...args) {
    const key = args[0];
    if (!cache.has(key)) cache.set(key, fn(...args));
    return cache.get(key);
  };
}

export function setTargetPlatform(platform) {
  targetPlatform = platform;
}

/**
 * Convert rpx.
 * @param value
 * @param prop
 * @param platform
 * @return {String} Transformed value.
 */
export const convertUnit = cached((value, prop, platform) => {
  if (platform) {
    setTargetPlatform(platform);
  }
  return isRpx(value) ? calcRpx(value) : value;
});
