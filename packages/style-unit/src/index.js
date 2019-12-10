import { isWeb, isWeex } from 'universal-env';

const RPX_REG = /[-+]?\d*\.?\d+rpx/g;
const GLOBAL_RPX_COEFFICIENT = '__rpx_coefficient__';
const GLOBAL_VIEWPORT_WIDTH = '__viewport_width__';
const global =
  typeof window === 'object'
    ? window
    : typeof global === 'object'
      ? global
      : {};
// convertUnit method targetPlatform
let targetPlatform = isWeb ? 'web' : isWeex ? 'weex' : '';

// Init toFixed method
const unitPrecision = 4;
const toFixed = (number, precision) => {
  const multiplier = Math.pow(10, precision + 1);
  const wholeNumber = Math.floor(number * multiplier);
  return Math.round(wholeNumber / 10) * 10 / multiplier;
};

// Dedault decimal px transformer.
let decimalPixelTransformer = (rpx) => parseFloat(rpx) * getRpx() + 'px';

// Default decimal vw transformer.
const decimalVWTransformer = (rpx) => toFixed(parseFloat(rpx) / (getViewportWidth() / 100), unitPrecision) + 'vw';

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
  return global[GLOBAL_RPX_COEFFICIENT];
}

export function setRpx(rpx) {
  global[GLOBAL_RPX_COEFFICIENT] = rpx;
}

export function getViewportWidth() {
  return global[GLOBAL_VIEWPORT_WIDTH];
}

export function setViewportWidth(viewport) {
  global[GLOBAL_VIEWPORT_WIDTH] = viewport;
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
 * @param platform
 * @return {String} Transformed value.
 */
export function convertUnit(value, prop, platform) {
  let cacheKey = `${prop}-${value}`;
  const hit = cache[cacheKey];
  if (platform) {
    cacheKey += `-${platform}`;
    targetPlatform = platform;
  }
  if (hit) {
    return hit;
  } else {
    value = value + '';
    return cache[cacheKey] = isRpx(value) ? calcRpx(value) : value;
  }
}
